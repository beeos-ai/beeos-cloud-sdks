// Code generated from generator/native-go.mjs. DO NOT EDIT.
package native

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/url"
	"strconv"
	"strings"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

// WebSocketTransport allows a caller's transport while the default uses gorilla/websocket.
type WebSocketTransport interface {
	ReadMessage() (int, []byte, error)
	WriteMessage(int, []byte) error
	SetReadLimit(int64)
	SetReadDeadline(time.Time) error
	SetWriteDeadline(time.Time) error
	Subprotocol() string
	Close() error
}
type WebSocketDialer func(context.Context, string, string) (WebSocketTransport, error)

func defaultWebSocketDialer(ctx context.Context, endpoint, profile string) (WebSocketTransport, error) {
	dialer := websocket.Dialer{Subprotocols: []string{profile}, HandshakeTimeout: 5 * time.Second}
	connection, response, err := dialer.DialContext(ctx, endpoint, nil)
	if response != nil && response.Body != nil {
		response.Body.Close()
	}
	return connection, err
}

type ConnectOptions struct {
	RequestOptions
	LastServerSequence string
	Command, Cwd       string
	Args               []string
	Env                map[string]string
}
type SocketFrame struct {
	Type                   string      `json:"type"`
	ProtocolVersion        int         `json:"protocolVersion,omitempty"`
	ClientID               string      `json:"clientId,omitempty"`
	TerminalID             string      `json:"terminalId,omitempty"`
	Sequence               string      `json:"sequence,omitempty"`
	Resumed                bool        `json:"resumed,omitempty"`
	Data                   string      `json:"data,omitempty"`
	Encoding               string      `json:"encoding,omitempty"`
	Truncated              bool        `json:"truncated,omitempty"`
	ExitCode               *int        `json:"exitCode,omitempty"`
	Columns                int         `json:"columns,omitempty"`
	Rows                   int         `json:"rows,omitempty"`
	Code                   string      `json:"code,omitempty"`
	Message                string      `json:"message,omitempty"`
	TransportGeneration    int         `json:"transport_generation,omitempty"`
	ProtocolVersionDesktop int         `json:"protocol_version,omitempty"`
	ConnectionID           string      `json:"connection_id,omitempty"`
	ICETransportPolicy     string      `json:"ice_transport_policy,omitempty"`
	ICEServers             []ICEServer `json:"ice_servers,omitempty"`
	RFBProfile             string      `json:"rfb_profile,omitempty"`
	SDP                    string      `json:"sdp,omitempty"`
	Candidate              string      `json:"candidate,omitempty"`
	SDPMid                 *string     `json:"sdp_mid,omitempty"`
	SDPMlineIndex          *int        `json:"sdp_mline_index,omitempty"`
	Binary                 []byte      `json:"-"`
}
type ICEServer struct {
	URLs       []string `json:"urls"`
	Username   string   `json:"username"`
	Credential string   `json:"credential"`
}
type SocketConnection struct {
	transport WebSocketTransport
	// Metadata omits the one-use ticket secret.
	Ticket             AccessTicket
	mu                 sync.Mutex
	sequence           uint64
	LastServerSequence string
	desktopGeneration  int
	closeOnce          sync.Once
	stopContext        func() bool
}
type ConnectionError struct {
	Ticket     AccessTicket
	Acceptance *Acceptance
	Cause      error
}

func (err *ConnectionError) Error() string { return "Connection admission failed" }
func (err *ConnectionError) Unwrap() error { return err.Cause }

type TerminalConnection = SocketConnection
type DesktopSignalingConnection = SocketConnection

func connectNativeSocket(ctx context.Context, client *Client, sandboxID string, body AccessTicketCreate, options ConnectOptions) (result *SocketConnection, returnedErr error) {
	accepted, err := client.AccessTickets.Create(ctx, sandboxID, body, CreateSandboxAccessTicketOptions{RequestOptions: options.RequestOptions})
	if err != nil {
		return nil, err
	}
	ticket := accepted.Body.Data
	defer func() {
		if returnedErr != nil {
			metadata := ticket
			metadata.Ticket = ""
			returnedErr = &ConnectionError{Ticket: metadata, Acceptance: accepted.Acceptance, Cause: returnedErr}
		}
	}()
	endpoint, err := url.Parse(string(ticket.ConnectURL))
	if err != nil {
		return nil, err
	}
	if endpoint.Scheme != "wss" || endpoint.RawQuery != "" || endpoint.User != nil || endpoint.Fragment != "" {
		return nil, fmt.Errorf("access ticket must contain exact WSS URL without query credentials")
	}
	purpose := string(body.Purpose)
	profile := "beeos-terminal-v2"
	if purpose == "desktop" {
		profile = "beeos-desktop-v1"
	}
	if string(ticket.Profile) != profile || string(ticket.Purpose) != purpose || string(ticket.SandboxID) != sandboxID {
		return nil, fmt.Errorf("access ticket target/profile mismatch")
	}
	dial := client.options.WebSocketDialer
	if dial == nil {
		dial = defaultWebSocketDialer
	}
	admissionCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()
	transport, err := dial(admissionCtx, endpoint.String(), profile)
	if err != nil {
		return nil, err
	}
	connection := &SocketConnection{transport: transport, Ticket: ticket, desktopGeneration: 1, LastServerSequence: options.LastServerSequence}
	if connection.LastServerSequence == "" {
		connection.LastServerSequence = "0"
	}
	connection.Ticket.Ticket = ""
	connection.stopContext = context.AfterFunc(ctx, func() { _ = connection.Disconnect() })
	failed := true
	defer func() {
		if failed {
			connection.Disconnect()
		}
	}()
	if transport.Subprotocol() != profile {
		return nil, fmt.Errorf("WebSocket subprotocol mismatch")
	}
	transport.SetReadLimit(1024 * 1024)
	deadline, _ := admissionCtx.Deadline()
	if err = transport.SetReadDeadline(deadline); err != nil {
		return nil, err
	}
	if err = transport.SetWriteDeadline(deadline); err != nil {
		return nil, err
	}
	if err = connection.sendJSON(map[string]any{"type": "authenticate", "profile": profile, "ticket": ticket.Ticket}); err != nil {
		return nil, err
	}
	_, raw, err := transport.ReadMessage()
	if err != nil {
		return nil, err
	}
	var authenticated struct {
		Type, Profile string
		ClientID      string `json:"client_id"`
		SandboxID     string `json:"sandbox_id"`
		TerminalID    string `json:"terminal_id"`
	}
	if err = json.Unmarshal(raw, &authenticated); err != nil {
		return nil, err
	}
	if authenticated.Type != "authenticated" || authenticated.Profile != profile || authenticated.ClientID != string(ticket.ClientID) || authenticated.SandboxID != sandboxID || (purpose == "pty" && (ticket.PtyID == nil || authenticated.TerminalID != *ticket.PtyID)) {
		return nil, fmt.Errorf("WebSocket authenticated identity mismatch")
	}
	if purpose == "pty" {
		fields := map[string]any{}
		kind := "terminal.open"
		if body.PtyID != nil {
			kind = "terminal.resume"
			cursor := options.LastServerSequence
			if cursor == "" {
				cursor = "0"
			}
			if _, err = strconv.ParseUint(cursor, 10, 64); err != nil {
				return nil, fmt.Errorf("invalid output cursor: %w", err)
			}
			fields["lastServerSequence"] = cursor
		} else {
			if body.Cols != nil {
				fields["columns"] = *body.Cols
			}
			if body.Rows != nil {
				fields["rows"] = *body.Rows
			}
			if options.Command != "" {
				fields["command"] = options.Command
			}
			if options.Cwd != "" {
				fields["cwd"] = options.Cwd
			}
			if options.Args != nil {
				fields["args"] = options.Args
			}
			if options.Env != nil {
				fields["env"] = options.Env
			}
		}
		if err = connection.sendTerminal(kind, fields); err != nil {
			return nil, err
		}
		frame, err := connection.Receive(admissionCtx)
		if err != nil {
			return nil, err
		}
		if frame.Type != "terminal.opened" || frame.ClientID != string(ticket.ClientID) || frame.TerminalID != *ticket.PtyID || frame.Resumed != (body.PtyID != nil) {
			return nil, fmt.Errorf("PTY did not open/resume requested terminal")
		}
	}
	if err = transport.SetReadDeadline(time.Time{}); err != nil {
		return nil, err
	}
	if err = transport.SetWriteDeadline(time.Time{}); err != nil {
		return nil, err
	}
	failed = false
	return connection, nil
}
func (connection *SocketConnection) sendJSON(value any) error {
	encoded, err := json.Marshal(value)
	if err != nil {
		return err
	}
	if len(encoded) > 1024*1024 {
		return fmt.Errorf("WebSocket frame exceeds 1 MiB")
	}
	return connection.transport.WriteMessage(websocket.TextMessage, encoded)
}
func (connection *SocketConnection) sendTerminal(kind string, fields map[string]any) error {
	connection.mu.Lock()
	defer connection.mu.Unlock()
	if connection.Ticket.Purpose != "pty" || connection.Ticket.PtyID == nil {
		return fmt.Errorf("connection is not a PTY")
	}
	if connection.sequence == ^uint64(0) {
		return fmt.Errorf("terminal client sequence exhausted")
	}
	connection.sequence++
	frame := map[string]any{"type": kind, "protocolVersion": 1, "clientId": connection.Ticket.ClientID, "terminalId": *connection.Ticket.PtyID, "clientSequence": strconv.FormatUint(connection.sequence, 10)}
	for key, value := range fields {
		frame[key] = value
	}
	return connection.sendJSON(frame)
}

// WriteInput confirms only local socket send. Unknown input is never replayed.
func (connection *SocketConnection) WriteInput(data, encoding string) error {
	if encoding == "" {
		encoding = "utf8"
	}
	decoded := []byte(data)
	if encoding == "base64" {
		var err error
		decoded, err = base64.StdEncoding.DecodeString(data)
		if err != nil {
			return err
		}
	} else if encoding != "utf8" {
		return fmt.Errorf("invalid terminal encoding")
	}
	if len(decoded) > 16384 {
		return fmt.Errorf("terminal input exceeds 16 KiB")
	}
	return connection.sendTerminal("terminal.input", map[string]any{"data": data, "encoding": encoding})
}
func (connection *SocketConnection) Resize(columns, rows int) error {
	if columns < 1 || columns > 1000 || rows < 1 || rows > 1000 {
		return fmt.Errorf("terminal dimensions must be 1–1000")
	}
	return connection.sendTerminal("terminal.resize", map[string]any{"columns": columns, "rows": rows})
}
func (connection *SocketConnection) Ping() error {
	return connection.sendTerminal("terminal.ping", nil)
}
func (connection *SocketConnection) CloseTerminal() error {
	return connection.sendTerminal("terminal.close", nil)
}
func (connection *SocketConnection) desktop(value any) error {
	connection.mu.Lock()
	defer connection.mu.Unlock()
	if connection.Ticket.Purpose != "desktop" {
		return fmt.Errorf("connection is not desktop")
	}
	return connection.sendJSON(value)
}
func (connection *SocketConnection) Offer(sdp string) error {
	return connection.desktop(map[string]any{"type": "offer", "protocol_version": 1, "sdp": sdp, "transport_generation": 1})
}
func (connection *SocketConnection) ICE(candidate string, mid *string, index *int) error {
	return connection.desktop(map[string]any{"type": "ice_candidate", "candidate": candidate, "sdp_mid": mid, "sdp_mline_index": index, "transport_generation": 1})
}
func (connection *SocketConnection) StartDesktop() error {
	return connection.desktop(map[string]any{"type": "desktop_start", "transport": "webrtc", "transport_generation": 1})
}

// StartDesktopStream sends start after the negotiated WebRTC DataChannel is open.
func (connection *SocketConnection) StartDesktopStream() error {
	return connection.desktop(map[string]any{"type": "start", "transport_generation": 1})
}
func (connection *SocketConnection) Fallback() error {
	return connection.desktop(map[string]any{"type": "fallback", "transport": "websocket", "protocol": "rfb-3.8", "transport_generation": 2})
}
func (connection *SocketConnection) SendDesktopBytes(data []byte) error {
	connection.mu.Lock()
	defer connection.mu.Unlock()
	if connection.Ticket.Purpose != "desktop" || connection.desktopGeneration != 2 {
		return fmt.Errorf("WSS desktop fallback is not admitted")
	}
	if len(data) > 1024*1024 {
		return fmt.Errorf("WebSocket frame exceeds 1 MiB")
	}
	return connection.transport.WriteMessage(websocket.BinaryMessage, data)
}
func (connection *SocketConnection) Receive(ctx context.Context) (SocketFrame, error) {
	var frame SocketFrame
	stop := context.AfterFunc(ctx, func() { _ = connection.Disconnect() })
	defer stop()
	for {
		kind, raw, err := connection.transport.ReadMessage()
		if err != nil {
			if ctx.Err() != nil {
				return frame, ctx.Err()
			}
			return frame, err
		}
		if kind == websocket.BinaryMessage {
			connection.mu.Lock()
			generation := connection.desktopGeneration
			connection.mu.Unlock()
			if connection.Ticket.Purpose != "desktop" || generation != 2 {
				return frame, fmt.Errorf("unexpected binary WebSocket frame")
			}
			frame.Binary = raw
			return frame, nil
		}
		if kind != websocket.TextMessage {
			return frame, fmt.Errorf("unexpected WebSocket message type")
		}
		if err = json.Unmarshal(raw, &frame); err != nil {
			return frame, err
		}
		if connection.Ticket.Purpose == "pty" {
			sequence, parseErr := strconv.ParseUint(frame.Sequence, 10, 64)
			if frame.ClientID != string(connection.Ticket.ClientID) || connection.Ticket.PtyID == nil || frame.TerminalID != *connection.Ticket.PtyID || frame.ProtocolVersion != 1 || !strings.HasPrefix(frame.Type, "terminal.") || parseErr != nil || sequence == 0 || strconv.FormatUint(sequence, 10) != frame.Sequence {
				return frame, fmt.Errorf("terminal frame identity or sequence mismatch")
			}
			connection.mu.Lock()
			previous, _ := strconv.ParseUint(connection.LastServerSequence, 10, 64)
			duplicate := frame.Type == "terminal.output" && sequence <= previous
			if sequence > previous {
				connection.LastServerSequence = frame.Sequence
			}
			connection.mu.Unlock()
			if duplicate {
				continue
			}
		} else if frame.Type == "fallback_ready" && frame.TransportGeneration == 2 {
			connection.mu.Lock()
			connection.desktopGeneration = 2
			connection.mu.Unlock()
		}
		return frame, nil
	}
}

// Disconnect releases the network only; use CloseTerminal for an explicit remote stop request.
func (connection *SocketConnection) Disconnect() error {
	var err error
	connection.closeOnce.Do(func() {
		if connection.stopContext != nil {
			connection.stopContext()
		}
		err = connection.transport.Close()
	})
	return err
}
