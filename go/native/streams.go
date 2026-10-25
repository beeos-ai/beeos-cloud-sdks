// Code generated from generator/native-go.mjs. DO NOT EDIT.
package native

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"strings"
	"sync"
)

// nativeEventTypes is the modeled NativeResponseEvent type set. A newer producer
// may emit another type; consumers skip it and the stream stays open.
var nativeEventTypes = map[string]bool{"response.phase": true, "response.output": true, "response.interaction": true, "response.completed": true, "response.failed": true, "response.incomplete": true, "response.cancelled": true, "response.unknown": true, "response.output_text.delta": true}

type EventStream[T any] struct {
	Status      int
	Headers     HTTPHeaders
	LastEventID string
	reader      io.ReadCloser
	scanner     *bufio.Scanner
	cancel      context.CancelFunc
	closeOnce   sync.Once
}

func splitSSELines(data []byte, atEOF bool) (int, []byte, error) {
	for index, value := range data {
		if value == '\n' {
			return index + 1, data[:index], nil
		}
		if value == '\r' {
			if index+1 == len(data) && !atEOF {
				return 0, nil, nil
			}
			advance := index + 1
			if advance < len(data) && data[advance] == '\n' {
				advance++
			}
			return advance, data[:index], nil
		}
	}
	if atEOF && len(data) > 0 {
		return len(data), data, nil
	}
	return 0, nil, nil
}
func openEventStream[T any](ctx context.Context, client *Client, op nativeOperation, path map[string]string, wire map[string]any, options RequestOptions) (*EventStream[T], error) {
	operation, err := newOperationContext(ctx, op, options)
	if err != nil {
		return nil, err
	}
	// Request timeout bounds the HTTP admission; the caller context owns the established stream.
	streamCtx, cancel := context.WithCancel(ctx)
	streamOptions := options
	response, stopRequest, err := makeRequest(streamCtx, client, op, path, nil, wire, streamOptions, operation)
	if err != nil {
		cancel()
		operation.cancel()
		return nil, err
	}
	if !strings.HasPrefix(strings.ToLower(response.Header.Get("Content-Type")), "text/event-stream") {
		response.Body.Close()
		stopRequest()
		cancel()
		return nil, fmt.Errorf("expected text/event-stream response")
	}
	stream := &EventStream[T]{Status: response.StatusCode, Headers: readHeaders(response.Header), reader: response.Body, cancel: func() { stopRequest(); cancel(); operation.cancel() }}
	if value, ok := wireValue(wire["Last-Event-ID"]); ok {
		stream.LastEventID = fmt.Sprint(value.Interface())
	}
	stream.scanner = bufio.NewScanner(response.Body)
	stream.scanner.Split(splitSSELines)
	stream.scanner.Buffer(make([]byte, 4096), 1024*1024+1)
	return stream, nil
}
func (stream *EventStream[T]) Close() error {
	var result error
	stream.closeOnce.Do(func() { result = stream.reader.Close(); stream.cancel() })
	return result
}
func (stream *EventStream[T]) Receive(ctx context.Context) (T, error) {
	var zero T
	stop := context.AfterFunc(ctx, func() { _ = stream.Close() })
	defer stop()
	var data []string
	size := 0
	first := true
	pendingID := stream.LastEventID
	for stream.scanner.Scan() {
		if ctx.Err() != nil {
			return zero, ctx.Err()
		}
		line := stream.scanner.Text()
		if first {
			line = strings.TrimPrefix(line, "\uFEFF")
			first = false
		}
		if line == "" {
			if len(data) == 0 {
				stream.LastEventID = pendingID
				size = 0
				continue
			}
			raw := strings.Join(data, "\n")
			var value T
			var header struct {
				Type string `json:"type"`
			}
			if err := json.Unmarshal([]byte(raw), &header); err != nil {
				_ = stream.Close()
				return zero, fmt.Errorf("invalid SSE JSON: %w", err)
			}
			stream.LastEventID = pendingID
			data = nil
			size = 0
			if _, ok := any(zero).(NativeResponseEvent); ok && !nativeEventTypes[header.Type] {
				continue
			}
			if err := json.Unmarshal([]byte(raw), &value); err != nil {
				_ = stream.Close()
				return zero, fmt.Errorf("invalid SSE JSON: %w", err)
			}
			return value, nil
		}
		size += len(line) + 1
		if size > 1024*1024 {
			_ = stream.Close()
			return zero, fmt.Errorf("SSE event exceeds 1 MiB")
		}
		if line[0] == ':' {
			continue
		}
		field, value, found := strings.Cut(line, ":")
		if found {
			value = strings.TrimPrefix(value, " ")
		}
		switch field {
		case "data":
			data = append(data, value)
		case "id":
			if !strings.ContainsRune(value, 0) {
				pendingID = value
			}
		}
	}
	_ = stream.Close()
	if ctx.Err() != nil {
		return zero, ctx.Err()
	}
	if err := stream.scanner.Err(); err != nil {
		return zero, err
	}
	return zero, io.EOF
}

type ResponseStream struct {
	ResponseID string
	Response   BeeOSHTTPResponse[NativeResponseResult]
	Events     *EventStream[NativeResponseEvent]
}
