// This example compiles without performing network requests.
package main

import (
	"context"
	sdk "github.com/beeos-ai/beeos-cloud-sdks/go/v2"
)

func typedUsage(ctx context.Context, client *sdk.BeeOSClient) (sdk.RuntimeInstanceResult, error) {
	variant, providerKey := "variant-from-catalog", "provided-at-runtime"
	instance, err := client.WithExternalUser("customer-42").Instances.Create(ctx, sdk.CreateServerInstanceInput{
		Name: "typed-example", VariantID: &variant,
		LLM: &sdk.RuntimeLLM{
			Providers: []sdk.RuntimeLLMProvider{{ID: "custom", Protocol: sdk.RuntimeLLMProviderProtocolOpenai, BaseURL: "https://provider.example/v1", APIKey: &providerKey}},
			Models:    []sdk.RuntimeLLMModel{{ProviderID: "custom", Model: "example-model", Role: "primary", Order: 0}},
		},
	}, sdk.InstanceCreateOptions{IdempotencyKey: "example-operation-42"})
	if err != nil {
		return instance, err
	}
	input := "Hello"
	response, err := client.Responses.Create(ctx, sdk.UHPCreateResponseJSONRequest{Input: sdk.UHPCreateResponseJSONRequestInput{Variant1: &input}}, sdk.CreateResponseOptions{})
	if err != nil {
		return instance, err
	}
	if _, err := client.Responses.Get(ctx, response.ID); err != nil {
		return instance, err
	}
	if _, err := client.Responses.GetInputItems(ctx, response.ID); err != nil {
		return instance, err
	}
	if _, err := client.Harnesses.List(ctx); err != nil {
		return instance, err
	}
	if _, err := client.Catalog.GetDiscovery(ctx); err != nil {
		return instance, err
	}
	return instance, nil
}

func main() {
	_, _ = sdk.NewBeeOSClient("https://cloud.example/v1", func() string { return "provided-at-runtime" }, nil)
}

func typedStreamUsage(ctx context.Context, client *sdk.BeeOSClient) error {
	input := "Hello"
	stream, err := client.Responses.CreateStream(ctx, sdk.UHPCreateResponseJSONRequest{Input: sdk.UHPCreateResponseJSONRequestInput{Variant1: &input}}, sdk.CreateResponseOptions{})
	if err != nil {
		return err
	}
	defer stream.Close()
	event, err := stream.Next()
	if err != nil {
		return err
	}
	var sequence int64 = event.SequenceNumber
	var eventType string = event.Type
	_, _ = sequence, eventType
	return nil
}

func typedRuntimeDocuments(ctx context.Context, client *sdk.BeeOSClient) (string, error) {
	capabilities, err := client.Methods.GetCapabilities(ctx, "instance-1")
	if err != nil {
		return "", err
	}
	var manifest string = capabilities.ManifestID
	terminal, err := client.Instances.CreateTerminalSession(ctx, "instance-1", sdk.CreateTerminalSessionRequest{PlatformAgentID: "agent-1"})
	if err != nil {
		return "", err
	}
	var websocketURL string = terminal.WebsocketURL
	canvas, err := client.Instances.CreateCanvasSession(ctx, "instance-1", sdk.CreateCanvasSessionRequest{PlatformAgentID: "agent-1", ConversationID: "conversation-1"})
	if err != nil {
		return "", err
	}
	var relayURL string = canvas.RelayURL
	_, _, _ = manifest, websocketURL, relayURL
	_, err = client.Methods.Invoke(ctx, "instance-1", sdk.InvokeRuntimeMethodRequest{JSONrpc: "2.0", ID: "rpc-1", Method: "agent.invoke", Params: sdk.JSONValue(`{}`)}, sdk.InvokeRuntimeMethodOptions{IdempotencyKey: "operation-1"})
	return manifest, err
}
