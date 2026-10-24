package native

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"time"

	"github.com/gorilla/websocket"
)

func TestPTYHelperUsesRealWebSocketTicketAndNoInputReplay(t *testing.T) {
	frames := make(chan []map[string]any, 1)
	var endpoint string
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasSuffix(r.URL.Path, "/access-tickets") {
			if r.Header.Get("Authorization") != "Bearer bsk_private" {
				t.Error("server key not on REST")
			}
			jsonReply(w, 201, fmt.Sprintf(`{"data":{"id":"ticket","sandbox_id":"sandbox","purpose":"pty","ticket":"ONE_USE_SECRET","connect_url":%q,"profile":"beeos-terminal-v2","client_id":"client","pty_id":"terminal"}}`, endpoint))
			return
		}
		if r.URL.RawQuery != "" || r.Header.Get("Authorization") != "" {
			t.Error("credentials exposed to WebSocket URL/header")
		}
		upgrader := websocket.Upgrader{Subprotocols: []string{"beeos-terminal-v2"}}
		socket, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Error(err)
			return
		}
		defer socket.Close()
		var received []map[string]any
		read := func() map[string]any {
			_, data, err := socket.ReadMessage()
			if err != nil {
				t.Error(err)
				return nil
			}
			var frame map[string]any
			if err = json.Unmarshal(data, &frame); err != nil {
				t.Error(err)
			}
			received = append(received, frame)
			return frame
		}
		auth := read()
		if auth["type"] != "authenticate" || auth["ticket"] != "ONE_USE_SECRET" {
			t.Error("first-frame ticket missing")
		}
		socket.WriteJSON(map[string]any{"type": "authenticated", "profile": "beeos-terminal-v2", "client_id": "client", "sandbox_id": "sandbox", "terminal_id": "terminal"})
		open := read()
		if open["type"] != "terminal.open" || open["clientSequence"] != "1" {
			t.Error("PTY not opened after admission")
		}
		socket.WriteJSON(map[string]any{"type": "terminal.opened", "protocolVersion": 1, "clientId": "client", "terminalId": "terminal", "sequence": "9007199254740993", "resumed": false})
		read()
		read()
		_, _, err = socket.ReadMessage()
		if err == nil {
			t.Error("disconnect unexpectedly emitted another remote frame")
		}
		frames <- received
	})
	server := httptest.NewTLSServer(handler)
	defer server.Close()
	endpoint = "wss" + strings.TrimPrefix(server.URL, "https") + "/connect"
	transport := server.Client().Transport.(*http.Transport)
	client, err := NewClient(ClientOptions{BaseURL: server.URL, APIKey: "bsk_private", HTTPClient: server.Client(), WebSocketDialer: func(ctx context.Context, url, profile string) (WebSocketTransport, error) {
		dialer := websocket.Dialer{TLSClientConfig: transport.TLSClientConfig.Clone(), Subprotocols: []string{profile}}
		socket, _, err := dialer.DialContext(ctx, url, nil)
		return socket, err
	}})
	if err != nil {
		t.Fatal(err)
	}
	connection, err := client.Sandboxes.Pty.Connect(context.Background(), "sandbox", AccessTicketCreate{Cols: Pointer(int64(80)), Rows: Pointer(int64(24))}, ConnectOptions{})
	if err != nil {
		t.Fatal(err)
	}
	if connection.LastServerSequence != "9007199254740993" {
		t.Fatal("terminal output cursor lost integer precision")
	}
	if connection.Ticket.Ticket != "" {
		t.Fatal("one-use secret retained in public connection metadata")
	}
	if err = connection.WriteInput("echo once\n", "utf8"); err != nil {
		t.Fatal(err)
	}
	if err = connection.Resize(90, 30); err != nil {
		t.Fatal(err)
	}
	connection.Disconnect()
	select {
	case received := <-frames:
		if len(received) != 4 || received[2]["type"] != "terminal.input" || received[2]["clientSequence"] != "2" || received[3]["type"] != "terminal.resize" {
			t.Fatalf("unexpected frames %#v", received)
		}
	case <-time.After(time.Second):
		t.Fatal("WebSocket did not close")
	}
}
func TestDesktopHelperRequiresFallbackReceiptForBinary(t *testing.T) {
	socket := &memorySocket{profile: "beeos-desktop-v1", reads: [][]byte{[]byte(`{"type":"authenticated","profile":"beeos-desktop-v1","client_id":"client","sandbox_id":"sandbox"}`), []byte(`{"type":"fallback_ready","transport_generation":2}`)}}
	client, _ := testClient(t, func(w http.ResponseWriter, r *http.Request) {
		jsonReply(w, 201, `{"data":{"id":"ticket","sandbox_id":"sandbox","purpose":"desktop","ticket":"SECRET","connect_url":"wss://access.example/connect","profile":"beeos-desktop-v1","client_id":"client"}}`)
	})
	client.options.WebSocketDialer = func(context.Context, string, string) (WebSocketTransport, error) { return socket, nil }
	connection, err := client.Sandboxes.Desktop.Connect(context.Background(), "sandbox", AccessTicketCreate{}, ConnectOptions{})
	if err != nil {
		t.Fatal(err)
	}
	defer connection.Disconnect()
	if len(socket.writes) != 1 {
		t.Fatal("desktop stream started before channel negotiation")
	}
	for _, send := range []func() error{connection.StartDesktop, func() error { return connection.Offer("negotiated-sdp") }, func() error { return connection.ICE("candidate", nil, nil) }} {
		if err = send(); err != nil {
			t.Fatal(err)
		}
	}
	// The application calls this after its negotiated DataChannel reports open.
	if err = connection.StartDesktopStream(); err != nil {
		t.Fatal(err)
	}
	var streamStart map[string]any
	if err = json.Unmarshal(socket.writes[4], &streamStart); err != nil || len(streamStart) != 2 || streamStart["type"] != "start" || streamStart["transport_generation"] != float64(1) {
		t.Fatalf("incorrect desktop stream start: %s", socket.writes[4])
	}
	var candidate map[string]any
	if err = json.Unmarshal(socket.writes[3], &candidate); err != nil || candidate["type"] != "ice_candidate" {
		t.Fatal("ICE producer vocabulary changed")
	}
	if err = connection.SendDesktopBytes([]byte{1}); err == nil {
		t.Fatal("binary admitted before fallback")
	}
	if err = connection.Fallback(); err != nil {
		t.Fatal(err)
	}
	if err = connection.SendDesktopBytes([]byte{1}); err == nil {
		t.Fatal("fallback intent was mistaken for actual readiness")
	}
	if _, err = connection.Receive(context.Background()); err != nil {
		t.Fatal(err)
	}
	if err = connection.SendDesktopBytes([]byte{1}); err != nil {
		t.Fatal(err)
	}
}

type memorySocket struct {
	profile string
	reads   [][]byte
	writes  [][]byte
}

func (socket *memorySocket) ReadMessage() (int, []byte, error) {
	if len(socket.reads) == 0 {
		return 0, nil, fmt.Errorf("no frame")
	}
	raw := socket.reads[0]
	socket.reads = socket.reads[1:]
	return websocket.TextMessage, raw, nil
}
func (socket *memorySocket) WriteMessage(_ int, data []byte) error {
	socket.writes = append(socket.writes, append([]byte(nil), data...))
	return nil
}
func (socket *memorySocket) SetReadLimit(int64)               {}
func (socket *memorySocket) SetReadDeadline(time.Time) error  { return nil }
func (socket *memorySocket) SetWriteDeadline(time.Time) error { return nil }
func (socket *memorySocket) Subprotocol() string              { return socket.profile }
func (socket *memorySocket) Close() error                     { return nil }
