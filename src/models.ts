export type JSONValue = null | boolean | number | string | JSONValue[] | {
    [key: string]: JSONValue;
};
export interface paths {
    "/agents/{agentId}/conversations/{conversationId}/approval-mode": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Set the conversation approval mode */
        put: operations["setConversationApprovalMode"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/reasoning": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Set the conversation reasoning effort */
        put: operations["setConversationReasoning"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/client-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Create a client session
         * @description Issue a client token with request-scoped ttl_seconds. The omitted value normalizes to 600 before idempotency comparison; reusing an Idempotency-Key with a different normalized TTL returns 409 idempotency_conflict.
         */
        post: operations["createClientSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/client-sessions/{sessionId}/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Refresh a client session
         * @description Rotate the client token with request-scoped ttl_seconds. The omitted value normalizes to 600 before idempotency comparison; reusing an Idempotency-Key with a different normalized TTL returns 409 idempotency_conflict.
         */
        post: operations["refreshClientSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/client-sessions/{sessionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Revoke a client session */
        delete: operations["revokeClientSession"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-users/{externalUserId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post?: never;
        /** Start external user data deletion */
        delete: operations["deleteExternalUser"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/external-users/{externalUserId}/deletions/{deletionId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an external user data deletion */
        get: operations["getExternalUserDeletion"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/providers": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List providers */
        get: operations["listProviders"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/deploy/regions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List deploy regions */
        get: operations["listDeployRegions"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/deploy/models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List deploy models */
        get: operations["listDeployModels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instance-templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List instance templates */
        get: operations["listInstanceTemplates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instance-templates/{templateId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an instance template */
        get: operations["getInstanceTemplate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent-templates": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List agent templates */
        get: operations["listAgentTemplates"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List instances */
        get: operations["listInstances"];
        put?: never;
        /** Create an instance */
        post: operations["instanceCreate"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an instance */
        get: operations["getInstance"];
        put?: never;
        post?: never;
        /** Delete an instance */
        delete: operations["deleteInstance"];
        options?: never;
        head?: never;
        /** Update an instance */
        patch: operations["updateInstanceMetadata"];
        trace?: never;
    };
    "/instances/{instanceId}/status": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get instance status */
        get: operations["getInstanceStatus"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/start": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start an instance */
        post: operations["startInstance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/stop": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Stop an instance */
        post: operations["stopInstance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/upgrade": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Start an instance upgrade */
        post: operations["upgradeInstance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/upgrades/{jobId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an instance upgrade */
        get: operations["getInstanceUpgrade"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List agents */
        get: operations["listAgents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an agent */
        get: operations["getAgent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        /** Update agent exposure settings */
        patch: operations["updateAgent"];
        trace?: never;
    };
    "/agents/{agentId}/conversations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List conversations */
        get: operations["listAgentConversations"];
        put?: never;
        /** Create a conversation */
        post: operations["createAgentConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a conversation */
        get: operations["getConversation"];
        put?: never;
        post?: never;
        /** Delete a conversation */
        delete: operations["deleteConversation"];
        options?: never;
        head?: never;
        /** Rename a conversation */
        patch: operations["updateConversation"];
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List conversation messages */
        get: operations["listConversationMessages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/messages/{messageId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a conversation message */
        get: operations["getConversationMessage"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel conversation execution */
        post: operations["cancelConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/clear": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Clear conversation history */
        post: operations["clearConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/model": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        /** Set the conversation model override */
        put: operations["setConversationModel"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/usage/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the usage summary */
        get: operations["getUsageSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/terminal-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a terminal session */
        post: operations["createTerminalSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/canvas-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a canvas session */
        post: operations["createCanvasSession"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/exec": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Run a command in an instance */
        post: operations["execInstance"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/presign-upload": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a file upload URL */
        post: operations["presignFileUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{fileId}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm a file upload */
        post: operations["confirmFileUpload"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List files */
        get: operations["listFiles"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{fileId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a file */
        get: operations["getFile"];
        put?: never;
        post?: never;
        /** Delete a file */
        delete: operations["deleteFile"];
        options?: never;
        head?: never;
        /** Rename a file */
        patch: operations["renameFile"];
        trace?: never;
    };
    "/agent-templates/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an agent template */
        get: operations["getAgentTemplate"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/{fileId}/share": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a file share link */
        get: operations["getShareFileShare"];
        put?: never;
        /** Create a file share link */
        post: operations["createShareFileShare"];
        /** Revoke a file share link */
        delete: operations["revokeShareFileShare"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/file-shares/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resolve a file share link */
        get: operations["resolveFileShare"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/files/summary": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the file summary */
        get: operations["getFilesSummary"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/messages/{messageId}/share": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a reply share link */
        get: operations["getShareReply"];
        put?: never;
        /** Create a reply share link */
        post: operations["createShareReply"];
        /** Revoke a reply share link */
        delete: operations["revokeShareReply"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/reply-shares/{slug}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resolve a reply share link */
        get: operations["resolveReplyShare"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/connect-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an instance connect URL */
        get: operations["getInstanceConnectURL"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/stream-url": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an instance stream URL */
        get: operations["getInstanceStreamURL"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/conversations/{conversationId}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resume a paused conversation */
        post: operations["resumeConversation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List automations */
        get: operations["listAutomations"];
        put?: never;
        /** Create an automation */
        post: operations["createAutomation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{automationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an automation */
        get: operations["getAutomation"];
        put?: never;
        post?: never;
        /** Delete an automation */
        delete: operations["deleteAutomation"];
        options?: never;
        head?: never;
        /** Update an automation */
        patch: operations["updateAutomation"];
        trace?: never;
    };
    "/automations/{automationId}/pause": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Pause an automation */
        post: operations["pauseAutomation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{automationId}/resume": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resume an automation */
        post: operations["resumeAutomation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{automationId}/runs": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List automation runs */
        get: operations["listAutomationRuns"];
        put?: never;
        /** Start an automation run */
        post: operations["createAutomationRun"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/{automationId}/runs/{runId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an automation run */
        get: operations["getAutomationRun"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/automations/webhooks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a webhook automation */
        post: operations["createWebhookAutomation"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/audio/transcribe": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Transcribe audio */
        post: operations["transcribeAudio"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/canvases/{canvasId}/share": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a canvas share link */
        get: operations["getShareCanvas"];
        put?: never;
        /** Create a canvas share link */
        post: operations["createShareCanvas"];
        /** Revoke a canvas share link */
        delete: operations["deleteShareCanvas"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/canvases/{canvasId}/snapshots": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List canvas snapshots */
        get: operations["listCanvasSnapshots"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/canvases/{canvasId}/snapshots/{snapshotId}/restore": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Restore a canvas snapshot */
        post: operations["restoreCanvasSnapshot"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/instances/{instanceId}/canvas-sessions/{conversationId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Resolve a conversation canvas session */
        get: operations["getCanvasSession"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/bind/{id}/details": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get agent bind session details */
        get: operations["getAgentBindDetails"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/bind/{id}/confirm": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Confirm an agent bind session */
        post: operations["confirmAgentBind"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/portal/bind-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Create a portal bind session */
        post: operations["createPortalBind"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/portal/bind-sessions/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get a portal bind session */
        get: operations["getPortalBind"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/portal/bind-sessions/{id}/revoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Revoke a portal bind session */
        post: operations["revokePortalBind"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agent/portal/bind-sessions/{id}/resolve": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Resolve a portal bind session */
        post: operations["resolvePortalBind"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Send an A2A JSON-RPC request */
        post: operations["invokeA2A"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}/.well-known/agent-card.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the A2A agent card */
        get: operations["getA2AAgentCard"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}/.well-known/agent.json": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get the A2A agent card (legacy path) */
        get: operations["getA2AAgentCardLegacy"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}/tasks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List A2A tasks */
        get: operations["listA2ATasks"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}/tasks/{taskId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get an A2A task */
        get: operations["getA2ATask"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/a2a/{agentId}/tasks/{taskId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Cancel an A2A task */
        post: operations["cancelA2ATask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/uhp": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /**
         * Protocol discovery document
         * @description Served without authentication: a client must be able to learn whether it is talking to a UHP
         *     server, and which versions it speaks, before presenting credentials. The document contains
         *     nothing principal-specific.
         */
        get: operations["getDiscovery"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/harnesses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** List configured harnesses */
        get: operations["listHarnesses"];
        put?: never;
        /**
         * Create a configured harness
         * @description Synchronous: Cloud submits every runtime operation and waits (up to 45s, so use a client timeout of at least 60s) before responding. 502 harness_error lists per-item results in error.detail.operations[]; 504 beeos_harness_update_in_progress means work continues, retry the identical request after Retry-After (a create without an Idempotency-Key is not re-attached and would create a second harness); 409 beeos_harness_busy means a different write is in flight, retry after Retry-After; 409 beeos_idempotency_conflict means the Idempotency-Key was used with a different request; 503 harness_unavailable means the instance is not running or the operation journal is unavailable; 413 means the body exceeds 4 MiB (upload large skills as a Files blob). The optional Idempotency-Key header (1-128 visible ASCII characters) makes a create (POST, or PUT with template_id) safe to resend: the same key and request returns the same harness. instance_id and name are required and base must equal the instance runtime (422); template_id and template_version create the harness from an agent template; default_model is honored only here. a non-empty skills or mcp_servers is rejected on create (422 beeos_field_not_supported); add them with PUT. Not supported by BeeOS Cloud yet (422 beeos_field_not_supported): a non-empty system_prompt, disabled_tools, environment or plugins, or any max_step or timeout_seconds. An unchanged name and empty values are accepted, so a GET-modify-PUT round trip works.
         */
        post: operations["createHarness"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/harnesses/{harness_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Get one harness */
        get: operations["getHarness"];
        /**
         * Update a harness configuration
         * @description Synchronous: Cloud submits every runtime operation and waits (up to 45s, so use a client timeout of at least 60s) before responding. 502 harness_error lists per-item results in error.detail.operations[]; 504 beeos_harness_update_in_progress means work continues, retry the identical request after Retry-After (a create without an Idempotency-Key is not re-attached and would create a second harness); 409 beeos_harness_busy means a different write is in flight, retry after Retry-After; 409 beeos_idempotency_conflict means the Idempotency-Key was used with a different request; 503 harness_unavailable means the instance is not running or the operation journal is unavailable; 413 means the body exceeds 4 MiB (upload large skills as a Files blob). The optional Idempotency-Key header (1-128 visible ASCII characters) makes a create (POST, or PUT with template_id) safe to resend: the same key and request returns the same harness. An absent field is unchanged; a present list replaces the whole list. When skills is present it is diffed against the installed skills: listed skills with files, content or blob (exactly one) are installed; an installed skill listed with a different enabled flag is updated; installed skills that are omitted are uninstalled unless bundled with the runtime; a listed skill that is not installed and has no files, content or blob returns 422; enabled:false on a fresh install returns 422. When mcp_servers is present it is diffed against the runtime MCP servers: a server sent with a credential (headers or auth plus expires_at, at most 24 hours ahead) is set, a connected server sent without one is kept, omitted servers are unset; the url must be https and transport is http or sse; GET never returns a url or credential. 422 beeos_mcp_not_supported is returned only when the instance runtime has no MCP methods. base is immutable; a name change or a default_model different from the current one (without template_id) returns 422 beeos_field_not_supported. Not supported by BeeOS Cloud yet (422 beeos_field_not_supported): a non-empty system_prompt, disabled_tools, environment or plugins, or any max_step or timeout_seconds. An unchanged name and empty values are accepted, so a GET-modify-PUT round trip works.
         */
        put: operations["updateHarness"];
        post?: never;
        /**
         * Delete a harness
         * @description Not supported by BeeOS Cloud yet: returns 422 beeos_harness_delete_not_supported once the harness is found.
         */
        delete: operations["deleteHarness"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The model catalogue, by backend */
        get: operations["listModels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/harnesses/{harness_id}/models": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Models this harness can run */
        get: operations["listHarnessModels"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/responses": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Run a task
         * @description The core of the protocol. With `stream: false` the server returns one Response object when
         *     the task reaches a terminal state. With `stream: true` it returns `text/event-stream`
         *     carrying the events defined in the Streaming chapter.
         *
         *     Retries MUST carry `Idempotency-Key`: without one, a retry after a timeout runs the task a
         *     second time while the first may still be running.
         */
        post: operations["createResponse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/responses/{response_id}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Read a task back */
        get: operations["getResponse"];
        put?: never;
        post?: never;
        /**
         * Delete a stored response
         * @description Must not cancel a running task — deletion and cancellation are different intentions.
         */
        delete: operations["deleteResponse"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/responses/{response_id}/input_items": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** The input the task was created with */
        get: operations["getResponseInputItems"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/responses/{response_id}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /**
         * Cancel a running task
         * @description Idempotent. Cancelling an already-terminal task succeeds and changes nothing — a client
         *     retrying a cancel after a dropped connection must not be punished for having succeeded.
         */
        post: operations["cancelResponse"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/responses/{response_id}/events": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Stream or resume the events of a response */
        get: operations["getResponseEvents"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        /** @description Opaque App-local identifier. Exact dot-segment values '.' and '..' are reserved by T03-20260905-01. */
        ExternalUserID: string;
        ClientSessionInput: {
            /**
             * @description How the client token is bound to the client that will use it. It decides whether you send `origin` or `device_attestation`.
             * @enum {unknown}
             */
            client_type: "web" | "native";
            /** @description Operations the client token may perform on the Client API, 1 or more distinct names. Each name must be one of `context:read`, `instances:read`, `instances:write`, `agents:read`, `agents:invoke`, `files:read`, `files:write`, `files:delete`, `events:read`, `viewer:connect` and `terminal:connect`, and must be allowed for your app's clients. Any other name returns 403 `invalid_capability`. */
            requested_capabilities: string[];
            /**
             * Format: uri
             * @description Origin of the web page that will use the token, for example `https://app.example.com`. Required when `client_type` is `web`, and it must exactly match one of the allowed origins configured for the app; otherwise the request returns 403 `invalid_origin`. Not allowed when `client_type` is `native`, which also returns 403 `invalid_origin`.
             */
            origin?: string;
            /** @description Proof of the device key the token is bound to. Required when `client_type` is `native`; not allowed when `client_type` is `web`, which returns 403 `invalid_origin`. */
            device_attestation?: {
                /** @description Thumbprint of the device's public key, the base64url-encoded SHA-256 JWK thumbprint, at least 16 characters. Later Client API requests must be signed with the matching private key. */
                jkt: string;
            };
            /**
             * @description Requested token lifetime in seconds for this issuance. Explicit values outside 60..1800 return 400 invalid_request.
             * @default 600
             */
            ttl_seconds?: number;
        };
        Binding: {
            /**
             * @description How the token is bound to the client.
             * @enum {unknown}
             */
            client_type: "web" | "native";
            /**
             * Format: uri
             * @description Origin the token is bound to. Returned when `client_type` is `web`.
             */
            origin?: string;
            /** @description Thumbprint of the device key the token is bound to. Returned when `client_type` is `native`. */
            cnf_jkt?: string;
        };
        ClientSessionResponse: {
            /** @description Client token to send as the bearer credential to the Client API. It is shown only in this response, so store it securely on the client and never log it. */
            access_token: string;
            /**
             * @description Base URL of the Client API that accepts `access_token`.
             * @enum {unknown}
             */
            client_api_url: "https://client-api.cloud.beeos.ai/v1";
            /**
             * Format: date-time
             * @description Actual expiration of the issued token, capped by the remaining session authorization lifetime.
             */
            expires_at: string;
            /** @description ID of the client session. Use it to refresh or revoke the session. Refreshing issues a new token for the same session. */
            session_id: string;
            /** @description ID of the app the session belongs to. */
            app_id: string;
            /** @description Unused. Cloud does not accept an external user id. Stored sessions leave this empty. */
            external_user_id: string;
            /** @description Operations the token may perform on the Client API. They are the requested capabilities, without duplicates. */
            capabilities: string[];
            /** @description How the token is bound to the client, as requested when the session was created. */
            binding: components["schemas"]["Binding"];
        };
        DeletionAccepted: {
            /** @description ID of the deletion. Use it to read the progress of the deletion. */
            deletion_id: string;
            /**
             * @description State of the deletion when the request was accepted.
             * @enum {unknown}
             */
            status: "pending" | "processing" | "failed" | "completed";
        };
        Deletion: {
            /** @description ID of the deletion. */
            id: string;
            /** @description State of the deletion. Poll until it is `completed`. */
            status: string;
            /** @description Number of items deleted so far, as an object that maps a kind of data to a count. The counts are final when `status` is `completed`. Kinds can be added, so do not depend on a fixed set of keys. */
            deleted_resources: {
                [key: string]: number;
            };
        };
        Provider: {
            /** @description ID of the provider. */
            id: string;
            /** @description Display name of the provider. */
            name: string;
            description?: string;
            capabilities?: components["schemas"]["ProviderCapabilities"];
        };
        DeployRegion: {
            /** @description ID of the region. */
            id: string;
            /** @description Display name of the region. */
            name: string;
            /** @description Whether the region is currently available. */
            available: boolean;
        };
        DeployModel: {
            /** @description ID of the model, usually in `provider/model` form. */
            id: string;
            /** @description Display name of the model. */
            name: string;
            tier?: string;
            reasoning?: boolean;
            input?: string[];
            /** @description Maximum context window of the model, in tokens. */
            context_window?: number;
        };
        InstanceTemplate: {
            /** @description ID of the template. */
            id: string;
            /** @description Display name of the template. */
            name: string;
            /** @description Description of the template. */
            description?: string;
            logo_url?: string;
            sort_order?: number;
            harness?: string;
            provider_id?: string;
            specs?: components["schemas"]["CatalogSpec"][];
            /** @description Deployable variants of the template. Send a variant's `id` as `variant_id` when creating an instance. */
            variants?: components["schemas"]["CatalogVariant"][];
        };
        ProviderPage: {
            /** @description Providers that match the filters. */
            data: components["schemas"]["Provider"][];
            /** @description Number of providers that match the filters. */
            total: number;
        };
        RegionPage: {
            /** @description Regions that match the filters. */
            data: components["schemas"]["DeployRegion"][];
            /** @description Number of regions that match the filters. */
            total: number;
        };
        ModelPage: {
            /** @description Models that match the filters. */
            data: components["schemas"]["DeployModel"][];
            /** @description Number of models that match the filters. */
            total: number;
        };
        InstanceSummary: {
            /** @description Whether the instance has ever reached the running state. False means it has never delivered a running service. */
            has_ever_run: boolean;
            /** @description Unique ID of the instance. */
            id: string;
            /** @description ID of the organization that owns the instance. */
            organization_id: string;
            /** @description ID of the app the instance belongs to. */
            app_id: string;
            /** @description ID of the developer account the instance was created under. */
            developer_id: string;
            /** @description Display name of the instance. */
            name: string;
            /** @description Product harness name (for example `openclaw`), not a UHP `harness_id` (`chrn_*`). */
            harness: string;
            /** @description ID of the provider that hosts the instance. */
            provider_id: string;
            /** @description Region the instance is deployed in. */
            region: string;
            /** @description Operating system of the instance: `linux`, `windows`, `android` or `macos`. */
            os_type: string;
            /** @description Lifecycle phase of the instance: `pending`, `provisioning`, `running`, `stopped` or `terminated`. */
            status: string;
            /** @description Lifecycle phase the instance is being driven toward: `running`, `stopped` or `terminated`. */
            desired_status: string;
            /** @description Reachability of the instance's agent: `unknown`, `online` or `offline`. */
            connectivity: string;
            /** @description Status of the instance's message-channel connection: `unknown`, `connecting`, `connected`, `reconnecting`, `disconnected` or `failed`. It is reported independently of connectivity and is `unknown` while the instance is stopped or terminated, or has not reported recently. */
            ms_connection_status: string;
            /** @description Time the instance was created, as an RFC 3339 UTC timestamp. */
            created_at: string;
            /** @description Time the instance was last updated, as an RFC 3339 UTC timestamp. */
            updated_at: string;
            /**
             * Format: int64
             * @description Version of the instance record, starting at 1. Send it in the `If-Match` header of write requests so concurrent changes are detected.
             */
            resource_version: number;
            /** @description Variant trait. Key that selects the execution image for the instance. Not a container repository name. */
            image_slot?: string;
            /** @description Variant trait. AgentBay worker image. Never the platform `image_id`. */
            worker_image_id?: string;
            /** @description Variant trait. `served` when Cloud answers model-list and reasoning-level requests, `none` when it answers neither. Empty and unknown values behave as `none`. */
            model_catalog?: string;
            /** @description Variant trait. Key into the monthly fee table that prices the instance. */
            billing_slot?: string;
            /** @description Variant trait. UI icon selector. Clients must not derive it from `harness`. */
            icon_key?: string;
            /** @description Variant trait. Whether the instance accepts device-control commands. False means those commands are rejected. */
            device_control?: boolean;
            /** @description Variant trait. Profile of the agent runtime the instance uses. Known values are `openclaw`, `hermes` and `beeos-browser`. */
            runtime_profile?: string;
            /** @description Variant trait. Whether the free plan allows the instance's variant. False means the free plan does not allow it. */
            free_plan?: boolean;
            /** @description `agentbay`, `beeos`, or empty when self-hosted. */
            cloud_provider?: string;
        };
        InstancePage: {
            /** @description Instances on this page, newest first. */
            data: components["schemas"]["InstanceSummary"][];
            /** @description Total number of instances that match the filters, across all pages. */
            total: number;
        };
        ProviderCapabilities: {
            long_running: boolean;
            browser_use: boolean;
            code_exec: boolean;
            file_system: boolean;
            custom_image: boolean;
            device: boolean;
            max_duration_sec: number;
            cost_model: string;
        };
        CatalogSpecValue: {
            id: string;
            name: string;
            label: string;
            sort_order: number;
        };
        CatalogSpec: {
            id: string;
            name: string;
            label: string;
            values: components["schemas"]["CatalogSpecValue"][];
        };
        CatalogVariant: {
            /** @description ID of the variant. Send it as `variant_id` when creating an instance. */
            id: string;
            spec_value_ids: string[];
            sort_order: number;
        };
        InstanceTemplatePage: {
            /** @description Templates on the requested page. */
            data: components["schemas"]["InstanceTemplate"][];
            /** @description Total number of templates that match the filters, across all pages. */
            total: number;
        };
        AgentSnapshot: {
            /** @description ID of the agent. */
            id: string;
            /** @description ID of the instance the agent runs on. */
            instance_id: string;
            /** @description Name of the agent. */
            name: string;
            /** @description Human-readable name of the agent. Omitted when none is set. */
            display_name?: string;
            /** @description Description of the agent. Empty when none is set. */
            description: string;
            /** @description Whether the agent is currently provided by its instance. */
            status: string;
            /** @description Which callers other than the owner can use the agent. Change it with the update operation. */
            visibility: string;
            /** @description How conversation messages reach the agent. New values can be added, so ignore values you do not know. */
            conversation_transport: string;
            /**
             * Format: int64
             * @description Version of the agent to send as `If-Match`, in double quotes, when you update it. The same value is returned in the `ETag` header when you read or update a single agent.
             */
            resource_version: number;
            /** @description Whether the agent is published as a tool through BeeOS MCP endpoints. */
            mcp_enabled: boolean;
            /** @description Whether the agent accepts Agent-to-Agent (A2A) requests. When false, A2A requests for the agent are refused with 403 `a2a_disabled`. */
            a2a_enabled: boolean;
            /** @description Features the agent supports, as an object that maps a feature name to true or false. Known names include `canvas`, `terminal`, `webSsh`, `fileSystem`, `image`, `audio`, `mcp`, `cron`, `streaming`, `pushNotifications`, `a2a`, `extendedAgentCard`, `multipleConversations`, `loadConversation`, `createConversation`, `modelsList`, `modelsSet`, `skillsList`, `skillsInstall`, `skillsUninstall`, `skillsUpdate` and `automationWake`. A name that is absent or false means the agent does not support the feature. New names can be added, so ignore names you do not know. */
            capabilities: {
                [key: string]: boolean;
            };
            /** @description Skills of the agent. */
            skills: components["schemas"]["AgentSkill"][];
            /**
             * Format: date-time
             * @description Time the agent was created, in RFC 3339 format.
             */
            created_at: string;
            /**
             * Format: date-time
             * @description Time the agent was last changed, in RFC 3339 format.
             */
            updated_at: string;
        };
        AgentSkill: {
            /** @description ID of the skill. Empty when the instance did not report one. */
            id: string;
            /** @description Name of the skill. */
            name: string;
            /** @description What the skill does. */
            description: string;
            /** @description Tags that describe the skill. Empty when there are none. */
            tags: string[];
            /** @description Whether the skill is currently enabled for the agent. */
            enabled: boolean;
        };
        /** @description Exposure settings to change. Send at least one field; fields you omit keep their current value. */
        AgentPatch: {
            /**
             * @description New visibility of the agent. The values are described on the `visibility` field of the agent.
             * @enum {string}
             */
            visibility?: "private" | "unlisted" | "org" | "public" | "marketplace";
            /** @description Set to true to publish the agent as a tool through BeeOS MCP endpoints, or to false to stop publishing it. */
            mcp_enabled?: boolean;
            /** @description Set to true to let the agent accept Agent-to-Agent (A2A) requests, or to false to refuse them with 403 `a2a_disabled`. */
            a2a_enabled?: boolean;
        };
        AgentResponse: {
            /** @description The agent. */
            data: components["schemas"]["AgentSnapshot"];
        };
        AgentPage: {
            /** @description Agents on this page, newest first. */
            data: components["schemas"]["AgentAgent"][];
            /** @description Total number of agents that match the filters, across all pages. */
            total: number;
        };
        CreateConversationInput: {
            /** @description Title of the new conversation, at most 512 bytes of valid UTF-8. Omit it to create a conversation without a title. */
            title?: string;
        };
        Conversation: {
            /** @description ID of the conversation. */
            id: string;
            /** @description ID of the agent the conversation is with, the `id` returned by the agents API. */
            agent_id: string;
            /** @description ID of the instance the agent runs on. */
            instance_id: string;
            /** @description Title of the conversation. Empty when no title was set. */
            title: string;
            /**
             * @description Whether the conversation still accepts messages. A closed conversation stays readable but cannot receive new messages.
             * @enum {string}
             */
            state: "open" | "closed";
            /**
             * Format: int64
             * @description Version of the conversation settings (title, model override, reasoning and approval mode). It increases by one on every change. It always equals `resource_version`.
             */
            metadata_version: number;
            /**
             * Format: int64
             * @description Generation of the conversation history. It increases by one each time the history is cleared, so a larger value means messages sent before the latest clear are no longer part of the history.
             */
            history_generation: number;
            /**
             * Format: date-time
             * @description Time the conversation was created, in RFC 3339 format.
             */
            created_at: string;
            /**
             * Format: date-time
             * @description Time of the latest activity in the conversation, in RFC 3339 format. Omitted when no activity is recorded.
             */
            last_activity_at?: string;
            /**
             * Format: date-time
             * @description Time the conversation was closed, in RFC 3339 format. Omitted while the conversation is open.
             */
            closed_at?: string;
            /**
             * Format: int64
             * @description Version of the conversation to send as `If-Match`, in double quotes, when you rename it or change its model, reasoning or approval mode. The same value is returned in the `ETag` header when you read or update a single conversation.
             */
            resource_version: number;
            /** @description ID of the model that overrides the agent's default model for this conversation. Omitted when no override is set. */
            model_override_id?: string;
            /** @description Reserved. The Server API does not currently return this field; use `model_override_id`. */
            effective_model_id?: string;
            /** @description The response that is currently being produced in the conversation. Returned only when you read a single conversation, and only while a response is in progress. */
            active_response?: components["schemas"]["ActiveConversationResponse"];
            /** @description Reasoning selection set for the conversation: the model and the reasoning option chosen for it. Omitted when none is set. It is cleared when `model_override_id` changes. */
            reasoning?: components["schemas"]["ReasoningSettings"];
            approval_mode?: string | null;
        };
        ConversationResponse: {
            /** @description The conversation. */
            data: components["schemas"]["Conversation"];
        };
        ConversationPage: {
            /** @description Conversations on this page. */
            conversations: components["schemas"]["Conversation"][];
            /** @description Cursor to pass as `cursor` to get the next page. Empty when `has_more` is false. */
            next_cursor?: string;
            /** @description Whether more conversations are available after this page. */
            has_more: boolean;
        };
        Message: {
            /** @description ID of the message. */
            id: string;
            /** @description ID of the conversation the message belongs to. */
            conversation_id: string;
            /** @description Kind of the message. Use it to tell the caller's prompts from the agent's replies and other messages. New kinds can be added, so ignore values you do not know. */
            type: string;
            /** @description Payload of the message as JSON. Its structure depends on `type`; see the variants listed for this field. For current agent replies read `body` and `parts` instead. The server removes the `metadata` and `from` keys before returning it. */
            content: JSONValue;
            /** @description Identity that sent the message. Other senders appear as their own identity ID. */
            sender: string;
            /** @description ID of the message this message replies to, for example the `chat_message` an `agent_reply` answers. Omitted for messages that are not replies. */
            reply_to?: string;
            /**
             * Format: date-time
             * @description Time the message was created, in RFC 3339 format.
             */
            created_at: string;
            /**
             * Format: int64
             * @description Position of the message in the conversation history. Newer messages have larger offsets.
             */
            offset: number;
            /**
             * Format: int64
             * @description Generation of the conversation history the message belongs to.
             */
            history_generation: number;
            /** @description Lifecycle state of the message. A message starts as `streaming` and moves exactly once to one of the final states; a final message never changes again. Messages stored before states existed have an empty state and are final. */
            state?: string;
            /** @description Why the message reached a final state. Present only on final messages and can be empty when the reason is unknown. */
            stop_reason?: string;
            /** @description Text of the message. For a reply that is still `streaming` it is the text produced so far. */
            body?: string;
            /** @description Structured parts of the message in order, such as reasoning, tool calls, files and sources. Each part has a `type`; see the variants listed for the items of this field. */
            parts?: {
                [key: string]: JSONValue;
            }[];
            /**
             * Format: date-time
             * @description Time the message was last changed, in RFC 3339 format. Omitted when the message was never updated.
             */
            updated_at?: string;
            /** @description Result of handing the message to the agent runtime, as an object with `status` and `code`. Present only when a dispatch result is recorded for the message; otherwise omitted. */
            runtime_dispatch?: {
                [key: string]: JSONValue;
            };
            /**
             * @description Reserved. The Server API does not currently return this field.
             * @enum {string}
             */
            realtime_publish_status?: "published" | "unconfirmed" | "not_republished";
        };
        MessagePage: {
            /** @description Messages on this page. */
            messages: components["schemas"]["Message"][];
            /** @description Cursor to pass as `cursor` to get the next page. Empty when `has_more` is false. */
            next_cursor?: string;
            /** @description Whether more messages are available after this page. */
            has_more: boolean;
            /**
             * Format: int64
             * @description Upper bound of the offsets scanned for this page. It is not the history boundary; use `history_boundary_offset` for that.
             */
            latest_offset: number;
            /**
             * Format: int64
             * @description Generation of the conversation history this page was read from.
             */
            history_generation: number;
            /**
             * Format: int64
             * @description Offset of the history boundary for the current generation: the point a clear or recovery of the history moved the start of the history to.
             */
            history_boundary_offset: number;
        };
        MessageEnvelope: {
            /** @description ID of the message. */
            id: string;
            /** @description ID of the conversation the message belongs to. */
            conversation_id: string;
            /** @description Kind of the message. Use it to tell the caller's prompts from the agent's replies and other messages. New kinds can be added, so ignore values you do not know. */
            type: string;
            /** @description Identity that sent the message. Other senders appear as their own identity ID. */
            sender: string;
            /** @description ID of the message this message replies to, for example the `chat_message` an `agent_reply` answers. Omitted for messages that are not replies. */
            reply_to?: string;
            /** @description Text of the message. For a reply that is still `streaming` it is the text produced so far. */
            body: string;
            /** @description Structured parts of the message in order, such as reasoning, tool calls, files and sources. Each part has a `type`; see the variants listed for the items of this field. */
            parts?: {
                [key: string]: JSONValue;
            }[];
            /** @description Lifecycle state of the message. A message starts as `streaming` and moves exactly once to one of the final states; a final message never changes again. Messages stored before states existed have an empty state and are final. */
            state: string;
            /** @description Why the message reached a final state. Present only on final messages and can be empty when the reason is unknown. */
            stop_reason?: string;
            /** @description Reserved. The Server API does not currently return this field; read `body` and `parts`. */
            content?: JSONValue;
            /**
             * Format: date-time
             * @description Time the message was created, in RFC 3339 format.
             */
            created_at?: string;
            /**
             * Format: date-time
             * @description Time the message was last changed, in RFC 3339 format. Omitted when the message was never updated.
             */
            updated_at?: string;
        };
        MessageEnvelopeResponse: {
            /** @description The message. */
            data: components["schemas"]["MessageEnvelope"];
        };
        UpdateConversationInput: {
            /** @description New title of the conversation, 1 to 256 characters after leading and trailing whitespace is removed. */
            title: string;
        };
        CancelConversationInput: {
            /** @description ID of the `chat_message` whose turn should stop, 1 to 256 characters. */
            target_message_id: string;
            /** @description Why the turn is stopped, as free text of at most 256 characters. When it is omitted or empty, `user_request` is recorded. */
            reason?: string;
        };
        SetConversationModelInput: {
            model_override_id: string | null;
        };
        CommandReceipt: {
            /** @description ID of the request. For cancel and resume it identifies the control message that was sent to the agent; for a model change it is the ID of this HTTP request. */
            request_id: string;
            /** @description Outcome of the request at the time the call returned. */
            status: string;
        };
        CommandReceiptResponse: {
            /** @description The receipt of the request. */
            data: components["schemas"]["CommandReceipt"];
        };
        ClearConversationReceipt: {
            /** @description ID of the clear operation. Retrying with the same `Idempotency-Key` returns the same ID. */
            request_id: string;
            /** @description ID of the conversation that was cleared. */
            conversation_id: string;
            /**
             * Format: int64
             * @description History generation after the clear. Messages from earlier generations are no longer part of the conversation history.
             */
            current_generation: number;
            /** @description Outcome of the clear at the time the call returned. */
            status: string;
        };
        ClearConversationReceiptResponse: {
            /** @description The receipt of the clear operation. */
            data: components["schemas"]["ClearConversationReceipt"];
        };
        ActiveConversationResponse: {
            /** @description ID of the response being produced. Use it with the responses API. */
            response_id: string;
            /** @description ID of the latest event recorded for the response. Send it as `Last-Event-ID` to continue the response's event stream after that event. */
            last_event_id: string;
            /** @description ID of the `chat_message` that started the response. Omitted when it is not recorded. */
            user_message_id?: string;
            /** @description ID of the message the agent's reply is written to. Omitted until the reply message exists. */
            reply_message_id?: string;
        };
        ReasoningSettings: {
            /** @description ID of the model that `reasoningOverrideId` applies to, 1 to 512 characters. */
            modelId: string;
            reasoningOverrideId: string | null;
        };
        ReasoningResult: {
            /** @description Version of the conversation settings after this change. Send it, in double quotes, as `If-Match` of the next update. It is also returned in the `ETag` header. */
            metadata_version: number;
        };
        ReasoningResultResponse: {
            /** @description The result of the change. */
            data: components["schemas"]["ReasoningResult"];
        };
        ApprovalModeSettings: {
            approval_mode: string | null;
        };
        ApprovalModeResult: {
            approval_mode: string | null;
            /**
             * Format: int64
             * @description Version of the conversation settings after this change. Send it, in double quotes, as `If-Match` of the next update. It is also returned in the `ETag` header.
             */
            metadata_version: number;
            /** @description Outcome of the change at the time the call returned. */
            status: string;
        };
        ApprovalModeResultResponse: {
            /** @description The result of the change. */
            data: components["schemas"]["ApprovalModeResult"];
        };
        ErrorResponse: {
            /** @description Stable machine-readable error code, for example `invalid_request`, `version_mismatch` or `instance_not_found`. */
            code: string;
            /** @description Human-readable description of the error. Use `code`, not this text, to branch in code. */
            message: string;
            /** @description ID of the request, for support and tracing. */
            request_id: string;
        };
        UHPDiscovery: {
            /**
             * @description Object type: always `uhp.discovery`.
             * @enum {string}
             */
            object: "uhp.discovery";
            /**
             * @description Protocol the server speaks: always `uhp`, the Unified Harness Protocol.
             * @enum {string}
             */
            protocol: "uhp";
            /** @description Protocol versions the server speaks, as values of the `UHP-Version` header. */
            versions: string[];
            /** @description Protocol version the server uses when a request does not send a `UHP-Version` header. */
            default_version: string;
            /**
             * @description Coarse conformance class of the server. Branch on the flags in `capabilities`, which are exact, rather than on the class.
             * @enum {string}
             */
            conformance_class: "core" | "extended" | "full";
            /** @description What the server can do. A flag is `true` only when the endpoints behind it answer. */
            capabilities: components["schemas"]["UHPCapabilities"];
            /**
             * @description The Agent Plugins manifest schema identifiers this server installs. Present and non-empty
             *     when `capabilities.plugins` is true.
             * @example [
             *       "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
             *     ]
             */
            plugin_schemas?: string[];
            /** @description Information about the server. Besides `name` and `version` it may carry `availability`, a statement of how model availability is computed. */
            implementation?: {
                /** @description Name of the server implementation: `BeeOS Cloud`. */
                name?: string;
                /** @description Version of the server implementation. Omitted when it is not known. */
                version?: string;
            } & {
                [key: string]: JSONValue;
            };
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description Named booleans. A server reports `false` for a capability it does not implement rather than
         *     omitting it, so a client can distinguish "not supported" from "server predates this field".
         *     A client treats an absent key as `false`.
         */
        UHPCapabilities: {
            /** @description The server can stream a response as server-sent events. */
            streaming?: boolean;
            /** @description The server keeps sessions that later requests can continue. */
            sessions?: boolean;
            /** @description A running response can be cancelled. */
            cancellation?: boolean;
            /** @description The server accepts files as input to a request. */
            files_input?: boolean;
            /** @description The server returns files that a harness produced. */
            files_output?: boolean;
            /** @description The server can list existing sessions. */
            session_listing?: boolean;
            /** @description Harnesses can be created, updated and deleted through the API. */
            harness_management?: boolean;
            /** @description The server can share a session with other callers. */
            session_sharing?: boolean;
            /** @description The server honors the `Idempotency-Key` header on the writes that accept it. */
            idempotency?: boolean;
            /**
             * @description The server installs Agent Plugins packages into harnesses, serves their files, and exports
             *     a harness as a package. Optional at every class.
             */
            plugins?: boolean;
            /**
             * @description The server holds environments: a project's files and installed dependencies, built once,
             *     read-only at a fixed path in every session that names one. Optional at every class.
             */
            environments?: boolean;
            /**
             * @description The server holds memories: a tree of memories with access granted per node, records kept
             *     by a connected provider, and tools a harness's agent reaches them with. Optional at every class.
             */
            memories?: boolean;
        } & {
            [key: string]: boolean;
        };
        UHPHarness: {
            /** @description ID of the harness. It starts with `chrn_` and is the `harness_id` to use in other requests. */
            id: string;
            /**
             * @description Object type: always `harness`.
             * @enum {string}
             */
            object?: "harness";
            /** @description Display name of the harness. When the harness has no display name, its name is used, and then its ID. */
            name: string;
            /**
             * @description Opaque. Not enumerated by this specification — a client must treat it as a string, or the
             *     protocol would need revising every time a harness is released.
             * @example codex
             * @example claude-code
             * @example hermes
             */
            base: string;
            /** @description Human-readable name of `base`: `OpenClaw` for `openclaw` or `Hermes` for `hermes`. Omitted when the base has no known label. */
            baseLabel?: string;
            /** @description ID of the model the harness uses as its primary model. Omitted when it has none. */
            defaultModel?: string;
            /** @description System prompt of the harness. BeeOS Cloud does not support it, so it is never returned. */
            systemPrompt?: string;
            /** @description MCP servers attached to the harness. Returned only by a single-harness read while the instance is running, and only when the instance supports MCP servers; omitted in listings. */
            mcpServers?: components["schemas"]["UHPMcpServer"][];
            /** @description Skills installed on the harness. Returned only by a single-harness read while the instance is running; omitted in listings. */
            skills?: components["schemas"]["UHPSkill"][];
            /**
             * @description Installed plugins. Their servers and skills join the harness's own for every turn;
             *     `mcpServers` and `skills` above report only what was written to them directly.
             */
            plugins?: components["schemas"]["UHPPlugin"][];
            /**
             * @description The environment (`henv_`) this harness's tasks read, mounted read-only at its `mount`;
             *     empty when none. A task may name another with its own `environment` field.
             */
            environment?: string;
            /** @description Names of tools disabled for the harness. BeeOS Cloud does not support it, so it is never returned. */
            disabledTools?: string[];
            /** @description Maximum number of steps per run. BeeOS Cloud does not support it, so it is never returned. */
            maxStep?: number | null;
            /** @description Run timeout in seconds. BeeOS Cloud does not support it, so it is never returned. */
            timeoutSeconds?: number | null;
            /** @description Unix milliseconds */
            createdAt?: number;
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description A remote MCP server attached to a harness. Only enabled entries are connected for a turn; a
         *     disabled entry must not be contacted at all. An unreachable server must not fail the task.
         *     Unchanged from 2026-08-11: a process (stdio) server is declared inside a plugin, see
         *     PluginMcpServer.
         */
        UHPMcpServer: {
            /** @description Sanitised to a CLI-safe identifier by the server. */
            name: string;
            /**
             * Format: uri
             * @description HTTPS endpoint of the MCP server, at most 2048 characters, without user information or a fragment. Reads report it empty.
             */
            url: string;
            /**
             * @description Transport the server speaks. Defaults to `http` on write. Not returned for a server that uses neither transport.
             * @default http
             * @enum {string}
             */
            transport?: "http" | "sse";
            /**
             * @description Whether the server is enabled. Reads always report `true`. A server can only be set or removed: sending `false` is rejected with 422 `invalid_input`.
             * @default true
             */
            enabled?: boolean;
            /** @description Request headers to send to the server, for example credentials. Header names and values must be non-empty. Never returned. Sending headers or `auth` also requires `expires_at`. */
            headers?: {
                [key: string]: string;
            };
            /**
             * @description Bearer token, or a server-side reference the server resolves. A server must never return
             *     a resolved credential to a client.
             */
            auth?: string;
            /**
             * Format: date-time
             * @description BeeOS extension. Expiry of the supplied short-lived credential; the caller refreshes it with another PUT.
             */
            expires_at?: string;
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description An MCP server a plugin's mcp.json declares, derived by the server. The harness MCP server
         *     object plus the `stdio` transport: `url` is required for `http` and `sse`, `command` for
         *     `stdio`. Placeholders are reported unexpanded; `enabled` is always true, the plugin's own
         *     `enabled` governs.
         */
        UHPPluginMcpServer: ({
            /** @description Name of the server, as declared in `mcp.json`. */
            name: string;
            /**
             * @description `http` is Streamable HTTP (`streamable-http` in mcp.json); `sse` the older HTTP+SSE
             *     transport; `stdio` a process the server launches inside the agent's sandbox.
             * @default http
             * @enum {string}
             */
            transport?: "http" | "sse" | "stdio";
            /**
             * Format: uri
             * @description Endpoint (`http` and `sse`).
             */
            url?: string;
            /** @description Fixed request headers (`http` and `sse`). Never subject to placeholder expansion. */
            headers?: {
                [key: string]: string;
            };
            /**
             * @description One executable token (`stdio`): a bare name resolved on the sandbox's search path, or a
             *     plugin-relative path beginning with `./`. Never a shell string, never expanded.
             */
            command?: string;
            /** @description Arguments (`stdio`). `${PLUGIN_ROOT}` and `${PLUGIN_DATA}` expand at run time. */
            args?: string[];
            /**
             * @description Environment overlay (`stdio`). Must not name PLUGIN_ROOT or PLUGIN_DATA; the server sets
             *     those. Values expand at run time.
             */
            env?: {
                [key: string]: string;
            };
            /**
             * @description Working directory (`stdio`). Defaults to the plugin root; must stay within the plugin
             *     root or PLUGIN_DATA.
             */
            cwd?: string;
            /**
             * @description Whether the server is enabled. Always `true` for a server derived from a plugin's `mcp.json`.
             * @default true
             */
            enabled?: boolean;
        } & {
            [key: string]: JSONValue;
        }) & JSONValue;
        /**
         * @description A skill is a FOLDER, not a file. A server must materialise the whole folder where the agent
         *     can read it — materialising only SKILL.md breaks every skill carrying references, scripts or
         *     data. Round-tripping a harness through GET and PUT must not lose skill contents.
         */
        UHPSkill: {
            /** @description Name of the skill, equal to the name of its folder. It is 1 to 128 lowercase letters, digits, dots, underscores and hyphens, starting with a letter or digit. An installed skill is 2 to 64 lowercase letters, digits and hyphens. */
            name: string;
            /**
             * @description false suppresses the skill, including one inherited from the base.
             * @default true
             */
            enabled?: boolean;
            /** @description The bundle. Must contain a SKILL.md. */
            files?: components["schemas"]["UHPSkillFile"][];
            /** @description Shorthand for a single-file bundle whose only member is SKILL.md. */
            content?: string;
            /**
             * @description Server-assigned handle for a bundle stored out of line. A client receives it, passes it
             *     back unchanged, and reads the files from the skill files endpoint.
             */
            blob?: string;
            /** @description BeeOS extension. SHA-256 of the Files bundle referenced by blob. */
            sha256?: string;
            /** @description BeeOS extension. Decimal byte size of the Files bundle referenced by blob. */
            size_bytes?: string;
        } & {
            [key: string]: JSONValue;
        };
        /** @description One file of a skill folder or of a plugin package. */
        UHPSkillFile: {
            /**
             * @description Relative to the skill's own folder, or to the plugin root; nested directories are
             *     supported. A server must reject a path that escapes the folder.
             * @example SKILL.md
             * @example references/codes.md
             * @example assets/logo.png
             */
            path: string;
            /** @description Text content. */
            content?: string;
            /** @description Base64 for binary content; preserved byte-for-byte. */
            content_b64?: string;
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description An Agent Plugins package installed into a harness: `plugin.json` at the root, MCP servers in
         *     `mcp.json`, skills under `skills/`. A client writes `files` (or passes back `blob`) and
         *     optionally `name` and `enabled`; the server derives `manifest`, `mcpServers`, `skills` and
         *     `skipped` from the package on every write and ignores those fields on input. A refused
         *     package leaves the harness unchanged.
         */
        UHPPlugin: {
            /** @description The manifest's `name`. Optional on write; if sent it must equal the manifest's. */
            name: string;
            /**
             * @description false keeps the plugin installed and inert; nothing in it is materialised or contacted.
             * @default true
             */
            enabled?: boolean;
            /** @description The package. Must contain `plugin.json` at its root. */
            files?: components["schemas"]["UHPSkillFile"][];
            /**
             * @description Server-assigned handle for a package stored out of line. A client passes it back unchanged
             *     and reads the files from the plugin files endpoint.
             */
            blob?: string;
            /** @description The plugin's `plugin.json`, parsed. */
            manifest?: components["schemas"]["UHPPluginManifest"];
            /**
             * @description Derived from `mcp.json`. Placeholders are reported unexpanded; `enabled` is always true,
             *     the plugin's own `enabled` governs.
             */
            mcpServers?: components["schemas"]["UHPPluginMcpServer"][];
            /** @description Derived from `skills/`, one entry per immediate child directory with a SKILL.md. */
            skills?: components["schemas"]["UHPPluginSkill"][];
            /**
             * @description What the server found and could not load. Present on every plugin object the server
             *     returns, empty when nothing was skipped.
             */
            skipped?: components["schemas"]["UHPPluginSkipped"][];
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description `plugin.json`, parsed. Mirrors the Agent Plugins 1.0.0 manifest schema
         *     (https://agent-plugins.org/schemas/1.0.0/plugin.schema.json, Apache-2.0) field for field, and
         *     permits additional properties because a UHP client ignores fields it does not know. The
         *     schema a manifest's own `$schema` names is authoritative; a server validates against that.
         */
        UHPPluginManifest: {
            /**
             * Format: uri
             * @description URI of the manifest schema that the file follows.
             */
            $schema: string;
            /** @description Name of the plugin: 1 to 64 lowercase letters, digits, dots and hyphens, starting and ending with a letter or digit. */
            name: string;
            /** @description Version of the plugin. */
            version?: string;
            /** @description Description of the plugin. */
            description?: string;
            /** @description Author of the plugin. */
            author?: {
                /** @description Name of the author. */
                name?: string;
                /** @description Email address of the author. */
                email?: string;
                /** @description URL of the author's web page. */
                url?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @description URL of the plugin's home page. */
            homepage?: string;
            /** @description Location of the plugin's source repository. */
            repository?: string;
            /** @description License of the plugin. */
            license?: string;
            /** @description Keywords that describe the plugin. */
            keywords?: string[];
            /** @description Client-specific data keyed by reverse-domain namespace, per Agent Plugins §8. */
            extensions?: {
                [key: string]: {
                    [key: string]: JSONValue;
                };
            };
        } & {
            [key: string]: JSONValue;
        };
        UHPPluginSkill: {
            /** @description The SKILL.md frontmatter name, equal to the directory name. */
            name: string;
            /** @description Description from the frontmatter of the skill's `SKILL.md`. */
            description?: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPPluginSkipped: {
            /**
             * @description Where in the package, e.g. `skills/broken`, `mcp.json#/mcpServers/redline`, `plugin.json#/vendorField`.
             * @example skills/broken
             * @example mcp.json#/mcpServers/redline
             */
            path: string;
            /** @description One sentence. */
            reason: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPHarnessCreate: {
            /** @description Display name of the harness. Required on create, 1 or more non-blank characters. On update it must equal the current name; renaming is rejected with 422 `beeos_field_not_supported`. */
            name?: string;
            /** @description Base (agent runtime) of the harness. On create it must equal the `harness` of the instance named by `instance_id`, otherwise the request fails with 422 `unsupported_base`. On update it must equal the harness's current base, which cannot be changed. */
            base: string;
            /** @description BeeOS Cloud honors this only on create; a different value on PUT returns 422 beeos_field_not_supported unless template_id is sent. */
            default_model?: string;
            /** @description System prompt. BeeOS Cloud does not support it: a non-empty value is rejected with 422 `beeos_field_not_supported`. */
            system_prompt?: string;
            /** @description Rejected on create (422 beeos_field_not_supported). On PUT the list is diffed against the runtime MCP servers: listed servers are set, omitted ones are unset; 422 beeos_mcp_not_supported only when the instance runtime has no MCP methods. */
            mcp_servers?: components["schemas"]["UHPMcpServer"][];
            /** @description Skills the harness should have. Not accepted on create. On update the list is the complete desired set: a skill that carries `files`, `content` or `blob` is installed, a listed installed skill only changes its `enabled` state, and an installed skill that is not listed is uninstalled, except bundled ones. */
            skills?: components["schemas"]["UHPSkill"][];
            /** @description Requires the `plugins` capability. Each item needs `files` or `blob`. */
            plugins?: components["schemas"]["UHPPlugin"][];
            /** @description An environment id of the caller's scope, or empty. Requires the `environments` capability. */
            environment?: string;
            /** @description Names of tools to disable. BeeOS Cloud does not support it: a non-empty list is rejected with 422 `beeos_field_not_supported`. */
            disabled_tools?: string[];
            /** @description Maximum number of steps per run. BeeOS Cloud does not support it: any value is rejected with 422 `beeos_field_not_supported`. */
            max_step?: number | null;
            /** @description Run timeout in seconds. BeeOS Cloud does not support it: any value is rejected with 422 `beeos_field_not_supported`. */
            timeout_seconds?: number | null;
            /** @description BeeOS extension. Instance that hosts a new harness (create only). */
            instance_id?: string;
            /** @description BeeOS extension. Agent template applied to the harness. */
            template_id?: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPModelCatalog: {
            /** @description Models the caller's harnesses may use, grouped by provider family. Each key is a provider family, the part of a model ID before the first `/`, for example `anthropic`. Each value holds the family's `default` model ID and its `models`; models whose ID has no family are not listed here. */
            backends: {
                [key: string]: {
                    default: string;
                    models: components["schemas"]["UHPModel"][];
                };
            };
        };
        UHPHarnessModels: {
            /** @description ID of the harness the models belong to. */
            harness_id?: string;
            /** @description Provider family that every listed model belongs to: the part of the model ID before the first `/`, for example `anthropic`. Omitted when the models belong to several families or to none. */
            backend?: string;
            /** @description ID of the harness's primary model. Omitted when it has none. */
            default?: string;
            /** @description Model used when a requested model cannot run. BeeOS Cloud does not report it, so it is never returned. */
            fallback?: string;
            /** @description Models the harness may use, in the order of its instance's model list. When that list is empty, only the primary model is listed. */
            models: components["schemas"]["UHPModel"][];
        };
        UHPModel: {
            /** @description ID of the model, usually in `provider/model` form, for example `anthropic/claude-sonnet-5`. */
            id: string;
            /** @description Display name of the model. BeeOS Cloud does not report one, so it is omitted. */
            label?: string;
            /** @description Provider family of the model: the part of `id` before the first `/`. Omitted when `id` has none. */
            backend?: string;
            /**
             * @description Computed, not asserted: true means the server can serve this model for this harness right
             *     now. Listing a model as available and then failing the task is the worst outcome for a
             *     client, because a user has already chosen it.
             */
            available: boolean;
            /** @description Whether this is the harness's primary model. */
            default?: boolean;
        } & {
            [key: string]: JSONValue;
        };
        UHPCreateResponseRequest: {
            /** @description A bare string is shorthand for one user message. */
            input: string | {
                [key: string]: JSONValue;
            }[];
            /** @description Model id for this turn. Omitted means the harness default. Any requested id is dispatched as given. */
            model?: string;
            /**
             * @description Client metadata, the extension point of the Responses surface. `harness_id` selects the
             *     configured harness; `environment` names the environment this task reads, overriding the
             *     harness's (capability `environments`), refused with `environment_not_found` or
             *     `environment_not_ready` before the task starts.
             */
            metadata?: {
                /** @description ID of the harness that runs the task. Optional when exactly one harness is in scope; required when there are several. */
                harness_id?: string;
                /** @description Name of an environment for the task to read. This server does not serve environments: a non-empty value is rejected with 404 `environment_not_found`. */
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /**
             * @description When true the response is streamed as server-sent events; see `UHPEvent`. Otherwise the call returns the finished response. Defaults to false.
             * @default false
             */
            stream?: boolean;
            /** @description ID of an earlier response to continue. The new response runs in the same session. The earlier response must exist and belong to the same harness. */
            previous_response_id?: string | null;
            /** @description Instructions placed before the input text and separated from it by a line containing `---`. */
            instructions?: string;
            /**
             * @description Whether to keep the response so it can be fetched later. Defaults to true.
             * @default true
             */
            store?: boolean;
            /** @description Reserved and ignored. It is reported in `metadata.ignored_fields` of the response. */
            max_output_tokens?: number | null;
            /** @description Agent step (tool-call round) budget */
            max_step?: number | null;
            /** @description Wall-clock budget */
            timeout_seconds?: number | null;
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. A UHP harness invokes and executes tools
             *     itself and reports them in `output`; there is no input path for a tool result, so the
             *     client-executed tool loop this field implies cannot be completed by a conformant server.
             *     Configure tools on the harness instead — see Harnesses §4.1. Tasks §1.4.
             */
            tools?: {
                [key: string]: JSONValue;
            }[];
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. No values are enumerated, so any string a
             *     server recognised would be one it named itself. Tasks §1.4.
             */
            include?: string[];
            /**
             * @description When true on a request that is not streamed, the call returns at once with the response still `in_progress`; fetch the result later. Ignored when `stream` is true.
             * @default false
             */
            background?: boolean;
        } & {
            [key: string]: JSONValue;
        };
        UHPResponse: {
            /** @description ID of the response. It starts with `resp_`. */
            id: string;
            /**
             * @description Object type.
             * @enum {string}
             */
            object: "response";
            /** @description Unix seconds */
            created_at: number;
            /** @description Status of the response. See `UHPResponseStatus` for the values. */
            status: components["schemas"]["UHPResponseStatus"];
            /** @description Non-null only when status is `failed`. */
            error?: null | components["schemas"]["UHPError"];
            /** @description Why the response is incomplete. When `status` is `incomplete` it holds `reason`, which is `timeout` when the time limit was reached. The protocol also defines `max_tokens` for the output limit, but this service does not currently produce it. Otherwise null. */
            incomplete_details?: {
                [key: string]: JSONValue;
            } | null;
            /** @description ID of the response this one continues, when the request set `previous_response_id`. */
            previous_response_id?: string | null;
            /** @description The model that actually ran. */
            model: string;
            /** @description Output items produced so far, in order. */
            output: components["schemas"]["UHPOutputItem"][];
            /** @description Whether the response is kept so it can be fetched later. */
            store?: boolean;
            /**
             * @description null when the server cannot account for usage. A fabricated zero would be worse than an
             *     honest absence, because a client cannot tell it from a free task.
             */
            usage?: null | components["schemas"]["UHPUsage"];
            /** @description Extra information about the run. */
            metadata?: {
                /** @description ID of the session the response ran in. Responses chained with `previous_response_id` share it. */
                session_id?: string;
                /** @description The environment the task read, when it read one (capability `environments`). */
                environment?: string;
                /** @description The id the client sent, when the client sent one. */
                requested_model?: string;
                /** @description True only when the harness reported it could not switch to the requested model. */
                model_fallback?: boolean;
                /** @description Why the harness ran its default model instead of the requested one. When the harness gives no reason, it is `The harness ran its default model.` */
                model_fallback_reason?: string;
                /**
                 * @description Request fields the server did not act on, by name, in any order. Required when the
                 *     request carried `tools` or `include`, which are reserved and ignored. A silently
                 *     ignored field is indistinguishable from an honoured one. Tasks §1.1 and §1.4.
                 */
                ignored_fields?: string[];
            } & {
                [key: string]: JSONValue;
            };
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description `incomplete` means a budget stopped the work and is usually worth continuing.
         *     `failed` means it could not be done. `cancelled` means the client asked for a stop, and must
         *     never be reported as `failed`.
         * @enum {string}
         */
        UHPResponseStatus: "in_progress" | "completed" | "failed" | "incomplete" | "cancelled";
        /**
         * @description A client must tolerate item types it does not recognise. A client that renders only `message`
         *     items and ignores the rest is a valid client.
         */
        UHPOutputItem: {
            /** @description ID of the output item. */
            id?: string;
            /**
             * @description Kind of the output item. Clients should ignore item types they do not know.
             * @example message
             * @example reasoning
             * @example function_call
             * @example function_call_output
             */
            type: string;
            /** @description Progress of the item. */
            status?: string;
            /** @description Who wrote a `message` item. */
            role?: string;
            /** @description Content parts of a `message` item. */
            content?: components["schemas"]["UHPContentPart"][];
            /** @description Summary of a `reasoning` item. */
            summary?: {
                [key: string]: JSONValue;
            }[];
            /** @description ID of the function call. A `function_call_output` item refers to its call with the same `call_id`. */
            call_id?: string;
            /** @description Name of the function the agent called. */
            name?: string;
            /** @description JSON, as a string */
            arguments?: string;
            /** @description Result of the function call, as text. */
            output?: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPContentPart: {
            /**
             * @description Kind of the part.
             * @example output_text
             */
            type: string;
            /** @description Text of the part. */
            text?: string;
            /** @description Annotations that refer to ranges of `text`. */
            annotations?: components["schemas"]["UHPAnnotation"][];
        } & {
            [key: string]: JSONValue;
        };
        UHPAnnotation: {
            /**
             * @description Kind of the annotation.
             * @enum {string}
             */
            type: "container_file_citation";
            /** @description ID of the container that holds the file. BeeOS does not currently set it. */
            container_id?: string;
            /** @description ID of the file. BeeOS does not currently set it. */
            file_id?: string;
            /** @description Name of the file. */
            filename?: string;
            /**
             * Format: uri
             * @description Absolute URL the file can be downloaded from.
             */
            download_url?: string;
            /** @description Start of the cited range in the text, counted in characters. BeeOS sets it to 0. */
            start_index?: number;
            /** @description End of the cited range in the text, counted in characters. BeeOS sets it to the length of the text. */
            end_index?: number;
        } & {
            [key: string]: JSONValue;
        };
        UHPUsage: {
            /** @description Number of input tokens. */
            input_tokens?: number;
            /** @description Number of output tokens. */
            output_tokens?: number;
            /** @description Total number of tokens used. */
            total_tokens?: number;
            /** @description Input tokens read from the cache. */
            cache_read_tokens?: number;
            /** @description Input tokens written to the cache. */
            cache_write_tokens?: number;
        } & {
            [key: string]: JSONValue;
        };
        UHPErrorEnvelope: {
            /** @description The error. */
            error: components["schemas"]["UHPError"];
            /**
             * @deprecated
             * @description A human-readable alias of `error.message`, retained for clients written against
             *     implementations that predate this envelope. Carries no information not in `error`.
             */
            detail?: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPError: {
            /**
             * @description Category of the error. It follows from the HTTP status.
             * @enum {string}
             */
            type: "invalid_request_error" | "authentication_error" | "permission_error" | "rate_limit_error" | "harness_error" | "server_error";
            /**
             * @description Specific and machine-readable. Servers may define additional codes for conditions this
             *     specification does not cover, and must namespace them with a vendor prefix so a future
             *     version cannot collide with them.
             * @example unsupported_protocol_version
             * @example invalid_input
             * @example harness_not_found
             * @example response_not_found
             * @example session_not_found
             * @example plugin_not_found
             * @example file_not_found
             * @example session_expired
             * @example harness_mismatch
             * @example session_busy
             * @example plugin_conflict
             * @example file_too_large
             * @example model_unavailable
             * @example unsupported_base
             * @example plugin_invalid
             * @example unsupported_plugin_schema
             * @example environment_not_found
             * @example environment_not_ready
             * @example environment_busy
             * @example environment_exists
             * @example environment_invalid
             * @example environment_unavailable
             * @example unsupported_transport
             * @example missing_credential
             * @example invalid_credential
             * @example insufficient_scope
             * @example rate_limited
             * @example quota_exhausted
             * @example harness_error
             * @example harness_unavailable
             * @example provider_error
             * @example timeout
             * @example cancelled
             * @example preview_unavailable
             * @example preview_failed
             */
            code: string;
            /**
             * @description One sentence, safe to show a user. Must not contain credentials, internal hostnames, file
             *     paths, or stack traces.
             */
            message: string;
            /** @description Dotted path to the offending field. */
            param?: string | null;
            /** @description Additional structured detail about the error, when available. */
            detail?: {
                [key: string]: JSONValue;
            } | null;
        } & {
            [key: string]: JSONValue;
        };
        /**
         * @description One streamed event. `sequence_number` starts at 0 and increases by exactly 1 per event, so a
         *     client can detect a dropped event rather than silently rendering a gap.
         */
        UHPEvent: {
            /**
             * @description Kind of the event. Clients should ignore event types they do not know. Exactly one of `response.completed`, `response.incomplete` and `response.failed` ends a stream.
             * @example response.created
             * @example response.in_progress
             * @example response.output_item.added
             * @example response.output_item.done
             * @example response.content_part.added
             * @example response.content_part.done
             * @example response.output_text.delta
             * @example response.output_text.done
             * @example response.output_text.annotation.added
             * @example response.reasoning_summary_part.added
             * @example response.reasoning_summary_text.delta
             * @example response.reasoning_summary_part.done
             * @example response.function_call_arguments.delta
             * @example response.function_call_arguments.done
             * @example response.completed
             * @example response.incomplete
             * @example response.failed
             * @example error
             */
            type: string;
            /** @description Position of the event in the stream, starting at 0 and increasing by 1 per event. A gap means an event was lost. */
            sequence_number: number;
            /** @description Snapshot of the response. Present on lifecycle events. */
            response?: components["schemas"]["UHPResponse"];
            /** @description The output item. Present on `response.output_item.added` and `response.output_item.done`. */
            item?: components["schemas"]["UHPOutputItem"];
            /** @description The content or summary part. Present on content part and reasoning summary part events. */
            part?: components["schemas"]["UHPContentPart"];
            /** @description The annotation. Present on `response.output_text.annotation.added`. */
            annotation?: components["schemas"]["UHPAnnotation"];
            /** @description New text, or new function arguments, since the previous delta. */
            delta?: string;
            /** @description The complete text. Present on `response.output_text.done`. */
            text?: string;
            /** @description The complete function arguments as a JSON string. Present on `response.function_call_arguments.done`. */
            arguments?: string;
            /** @description ID of the output item the event belongs to. */
            item_id?: string;
            /** @description Position of the item in the `output` of the response. */
            output_index?: number;
            /** @description Index of the content part within the item. */
            content_index?: number;
            /** @description Index of the summary part within the item. */
            summary_index?: number;
            /** @description Index of the annotation within the content part. */
            annotation_index?: number;
            /** @description Machine-readable error code. Present on `error` events. */
            code?: string;
            /** @description Readable error message. Present on `error` events. */
            message?: string;
            /** @description Dotted path of the field the error is about, or null. Present on `error` events. */
            param?: string | null;
        } & {
            [key: string]: null | boolean | number | string | JSONValue[] | {
                [key: string]: JSONValue;
            };
        };
        /** @description A genuinely open JSON value (provider/plugin parameters or arbitrary metadata). */
        JSONValue: null | boolean | number | string | JSONValue[] | {
            [key: string]: JSONValue;
        };
        RuntimeInstanceSummary: {
            /** @description Unique ID of the instance. */
            id: string;
            /** @description ID of the organization that owns the instance. */
            organization_id: string;
            /** @description ID of the app the instance belongs to. */
            app_id: string;
            /** @description ID of the developer account the instance was created under. */
            developer_id: string;
            /** @description Display name of the instance. */
            name: string;
            /** @description Product harness name (for example `openclaw`), not a UHP `harness_id` (`chrn_*`). */
            harness: string;
            /** @description ID of the provider that hosts the instance. */
            provider_id: string;
            /** @description Region the instance is deployed in. */
            region: string;
            /** @description Operating system of the instance: `linux`, `windows`, `android` or `macos`. */
            os_type: string;
            /** @description Lifecycle phase of the instance: `pending`, `provisioning`, `running`, `stopped` or `terminated`. */
            status: string;
            /** @description Lifecycle phase the instance is being driven toward: `running`, `stopped` or `terminated`. */
            desired_status: string;
            /** @description Reachability of the instance's agent: `unknown`, `online` or `offline`. */
            connectivity: string;
            /** @description Stable code describing a failure or degraded state reported with a lifecycle result, for example `quota_exceeded`, `capacity_pending`, `provision_failed` or `stop_failed`. Raw provider errors are never exported. */
            error_code?: string;
            /** @description Status of the instance's message-channel connection: `unknown`, `connecting`, `connected`, `reconnecting`, `disconnected` or `failed`. It is reported independently of connectivity and is `unknown` while the instance is stopped or terminated, or has not reported recently. */
            ms_connection_status: string;
            /** @description ID of the platform image the instance runs. */
            image_id?: string;
            /** @description ID of the platform image version the instance runs. */
            image_version_id?: string;
            /** @description Version label of the platform image the instance runs. */
            image_version?: string;
            /** @description Pinned public image reference. Provider configuration is never included. */
            image_ref?: string;
            /** @description Primary model configured for the instance. */
            model_primary?: string;
            /** @description Models configured for the instance. */
            models?: string[];
            /** @description Model providers and models supplied for the instance, with API keys removed. */
            llm?: components["schemas"]["RuntimeLLMView"] | null;
            /** @description Where the instance is hosted: `cloud` or `selfhosted`. */
            hosting_type?: string;
            /** @description `agentbay`, `beeos`, or empty when self-hosted. */
            cloud_provider?: string;
            /** @description Variant trait. Key that selects the execution image for the instance. Not a container repository name. */
            image_slot?: string;
            /** @description Variant trait. AgentBay worker image. Never the platform `image_id`. */
            worker_image_id?: string;
            /** @description Variant trait. `served` when Cloud answers model-list and reasoning-level requests, `none` when it answers neither. Empty and unknown values behave as `none`. */
            model_catalog?: string;
            /** @description Variant trait. Key into the monthly fee table that prices the instance. */
            billing_slot?: string;
            /** @description Variant trait. UI icon selector. Clients must not derive it from `harness`. */
            icon_key?: string;
            /** @description Variant trait. Whether the instance accepts device-control commands. False means those commands are rejected. */
            device_control: boolean;
            /** @description Variant trait. Profile of the agent runtime the instance uses. Known values are `openclaw`, `hermes` and `beeos-browser`. */
            runtime_profile?: string;
            /** @description Variant trait. Whether the free plan allows the instance's variant. False means the free plan does not allow it. */
            free_plan: boolean;
            /** @description Version of the instance record, starting at 1. Send it in the `If-Match` header of write requests so concurrent changes are detected. */
            resource_version: number;
            /** @description Whether the instance has ever reached the running state. False means it has never delivered a running service. */
            has_ever_run: boolean;
            /** @description Time the instance was created, as an RFC 3339 UTC timestamp. */
            created_at: string;
            /** @description Time the instance was last updated, as an RFC 3339 UTC timestamp. */
            updated_at: string;
            /** @description Capabilities declared for the instance when it was provisioned, as flags such as `computer`, `mobile`, `device` and `terminal`. An empty object means none were declared. */
            capabilities: {
                computer?: boolean;
                mobile?: boolean;
                device?: boolean;
                terminal?: boolean;
            };
        };
        RuntimeOperationSummary: {
            /** @description Unique ID of the operation. */
            id: string;
            /** @description Kind of operation: `create`, `start`, `stop`, `delete` or `image_upgrade`. */
            kind: string;
            /** @description Phase of the operation: `intent`, `reserved`, `admitted`, `provisioning`, `running`, `cleanup_pending`, `failed`, `stop_pending`, `stopped`, `delete_pending`, `deleted`, `upgrade_pending` or `rollback_pending`. It describes durable work, not observed instance health. */
            phase: string;
            /** @description Stable failure code, the same value as the instance `error_code`. Raw provider errors are never exported. */
            error_code?: string;
        };
        RuntimeInstanceResult: {
            /** @description The instance as of this response. */
            data: components["schemas"]["RuntimeInstanceSummary"];
            /** @description Lifecycle operation that this response reports on. */
            operation: components["schemas"]["RuntimeOperationSummary"];
        };
        RuntimeExecResult: {
            /** @description Exit code of the command. */
            exit_code: number;
            /** @description Standard output of the command, at most 64 KiB. */
            stdout: string;
            /** @description Standard error of the command, at most 64 KiB. */
            stderr: string;
            /** @description Whether the output was truncated. */
            truncated: boolean;
        };
        RuntimeLLM: {
            /** @description Model provider endpoints, 1 to 8 entries. Every provider must be referenced by at least one model. */
            providers: components["schemas"]["RuntimeLLMProvider"][];
            /** @description Selectable models, 1 to 256 entries. Exactly one has the `default` role. */
            models: components["schemas"]["RuntimeLLMModel"][];
        };
        RuntimeLLMView: {
            /** @description Model provider endpoints, without API keys. */
            providers: components["schemas"]["RuntimeLLMProviderView"][];
            /** @description Selectable models. */
            models: components["schemas"]["RuntimeLLMModel"][];
        };
        RuntimeLLMProvider: {
            /** @description Caller-chosen ID that models refer to. It is unique within the request, 1 to 64 characters from `A-Z`, `a-z`, `0-9`, `_` and `-`. */
            id: string;
            /**
             * @description API protocol the endpoint speaks: `openai` or `anthropic`.
             * @enum {string}
             */
            protocol: "openai" | "anthropic";
            /** @description HTTPS base URL of the provider API, at most 512 characters. It must not contain credentials, a query string or a fragment. */
            base_url: string;
            /** @description API key for the provider, 1 to 4096 characters without whitespace. It is write-only and never returned. */
            api_key?: string;
        };
        RuntimeLLMProviderView: {
            /** @description ID of the provider, as referenced by models. */
            id: string;
            /** @description API protocol the endpoint speaks: `openai` or `anthropic`. */
            protocol: string;
            /** @description HTTPS base URL of the provider API. */
            base_url: string;
        };
        RuntimeLLMModel: {
            /** @description ID of the provider that serves the model. */
            provider_id: string;
            /** @description Model name as the provider API expects it. It is unique per provider. */
            model: string;
            /** @description Role of the model: `default`, `fallback` or `available`. Exactly one model is `default`. Automatic failover uses only `fallback` models. */
            role: string;
            /** @description Position of the model, unique across all models. The `default` model has order 0; `fallback` and `available` models have order 1 or more. */
            order: number;
        };
        RuntimeUpgradeJob: {
            /** @description Unique ID of the upgrade job. */
            job_id: string;
            image_version_id?: string;
            /** @description ID of the instance being upgraded. */
            instance_id: string;
            /** @description Status of the job: `upgrade_pending`, `rollback_pending`, `failed` or `succeeded`. */
            status: string;
            /** @description Image version the instance is being upgraded to. */
            target: string;
            /** @description Time the job was created, as an RFC 3339 UTC timestamp. */
            created_at: string;
            /** @description Time the job finished, as an RFC 3339 UTC timestamp. Omitted while the job is not finished. */
            completed_at?: string | null;
            /** @description Stable failure code. Omitted unless the job failed. */
            error?: string | null;
        };
        FileFile: {
            /** @description Unique ID of the file. */
            file_id: string;
            /** @description Name of the file, without a path. */
            filename: string;
            /** @description MIME type of the file, for example image/png. */
            content_type: string;
            /** @description Size of the file in bytes. */
            size_bytes: number;
            /** @description Lowercase hex SHA-256 digest of the file content. Empty when no checksum was supplied at upload and none was recorded for the object. */
            checksum_sha256?: string;
            /** @description Upload state of the file. Deleted files are never returned. New states can be added, so ignore values you do not know. */
            status: string;
            /** @description Version of the file record. It starts at 1 and increases when the upload is confirmed and when the file is renamed or deleted. */
            resource_version: number;
            /**
             * Format: date-time
             * @description Time the file was last changed: created, confirmed or renamed, whichever is latest. RFC 3339 timestamp.
             */
            updated_at: string;
            /** @description Title read from the document's own metadata. It is extracted for PDF, docx, xlsx and pptx files of up to 8 MiB the first time the file is read by ID, and omitted when the document has no usable title. */
            title?: string;
            /** @description Category of the file, derived from its MIME type and, for generic types such as `application/octet-stream`, from its extension. */
            file_type: string;
            /**
             * Format: date-time
             * @description Time the file record was created, when the upload was prepared. RFC 3339 timestamp.
             */
            created_at: string;
            /** @description Time the upload was confirmed. Omitted until the file is ready. RFC 3339 timestamp. */
            confirmed_at?: string | null;
            /** @description Where the file came from, with the instance and agent it belongs to. */
            origin?: components["schemas"]["FileOrigin"] | null;
        };
        FileOrigin: {
            /** @description How the file came to exist. New values can be added, so ignore values you do not know. */
            source: string;
            /** @description ID of the instance the file belongs to. Omitted for files that are not tied to an instance. */
            instance_id?: string;
            /** @description ID of the agent the file belongs to. Omitted for files that are not tied to an agent. */
            agent_id?: string;
            /** @description ID of the agent operation that generated the file. Set only when `source` is `runtime_generated`. */
            operation_id?: string;
            /** @description Current display name of the instance, filled in when the file is returned. Omitted for files without an instance. */
            instance_name?: string;
            /** @description Current display name of the agent, filled in when the file is returned. Omitted for files without an agent. */
            agent_name?: string;
            /** @description URL of the agent avatar. Omitted for files without an agent. */
            avatar_url?: string;
            /** @description Harness the instance runs, for example `openclaw`. Omitted for files without an instance. */
            harness?: string;
            /** @description True when the instance has been terminated or deleted. The file stays available. Omitted when false. */
            destroyed?: boolean;
        };
        FileTransferDescriptor: {
            /** @description Whether the URL is used to upload or to download the file content. */
            direction: string;
            /** @description ID of the file the transfer is for. */
            file_id: string;
            /** @description Pre-signed URL to transfer the file content with. The URL is already signed, so do not send your API key to it. */
            url: string;
            /** @description HTTP method to use with `url`: `PUT` for an upload, `GET` for a download. */
            http_method: string;
            /** @description Headers to send with the transfer request exactly as given. Empty when none are required. */
            required_headers: {
                [key: string]: string;
            };
            /**
             * Format: date-time
             * @description Time the URL stops working, as an RFC 3339 timestamp. Upload URLs are valid for 15 minutes and download URLs for 5 minutes.
             */
            expires_at: string;
            /** @description MIME type of the file. */
            content_type: string;
            /** @description Size of the file in bytes. */
            size_bytes: number;
            /** @description Lowercase hex SHA-256 digest of the file content. Omitted when no digest is known. */
            checksum_sha256?: string;
        };
        FileChatUploadContext: {
            /** @description ID of the instance the file is uploaded for. It must belong to your app. */
            instance_id: string;
            /** @description ID of the agent the file is uploaded for. It must belong to the instance. Optional. */
            agent_id?: string;
        };
        FilePrepareUploadInput: {
            /** @description Ties the upload to an instance and optionally an agent. The credential's organization and app own the file. Omit the context for a plain upload. */
            upload_context?: components["schemas"]["FileChatUploadContext"] | null;
            /** @description Name of the file, 1 to 255 characters, without leading or trailing whitespace and without `/`, `\` or control characters. */
            filename: string;
            /** @description MIME type of the file, at most 255 characters and without control characters. The uploaded content must carry this type. */
            content_type: string;
            /** @description Size of the file in bytes, from 1 to 104857600 (100 MiB). The uploaded content must have exactly this size. */
            size_bytes: number;
            /** @description Lowercase hex SHA-256 digest of the content (64 characters). Optional. When sent, the uploaded content must match it and the confirmation verifies it. */
            checksum_sha256?: string;
        };
        FileConfirmInput: {
            /** @description Lowercase hex SHA-256 digest of the uploaded content (64 characters). Optional. When sent, it is compared with the digest of the stored object and a difference fails the confirmation with 409 `checksum_mismatch`. */
            checksum_sha256?: string;
        };
        FilePage: {
            /** @description Files on this page. */
            data: components["schemas"]["FileFile"][];
            /** @description Number of files that match the query, across all pages. */
            total: number;
            /** @description Cursor to pass as `since` to get the next page. Returned only by the default chronological listing, and only when more files follow. Filtered or sorted listings page with `offset` instead. */
            next_since?: string;
        };
        FileResolution: {
            /** @description The file. */
            file: components["schemas"]["FileFile"];
            /** @description Pre-signed descriptor to download the content with. While the file is still `pending_upload` it carries no usable URL. */
            download: components["schemas"]["FileTransferDescriptor"];
        };
        FileSummary: {
            /** @description Number of ready files. */
            file_count: number;
            /** @description Number of ready files that count toward storage. Files provided by template skills are not counted. */
            storage_file_count: number;
            /** @description Total size in bytes of the files that count toward storage. */
            used_bytes: number;
            /** @description Number of ready files in the `FILE_TYPE_IMAGE` category. */
            image_count: number;
            /** @description Number of ready files in the `FILE_TYPE_VIDEO` category. */
            video_count: number;
            /** @description Number of ready files in the `FILE_TYPE_DOCUMENT` category. */
            document_count: number;
            /** @description Ready files grouped by the agent they belong to, or by instance when they have no agent, largest group first. */
            instances: {
                /** @description How the file came to exist. New values can be added, so ignore values you do not know. */
                source: string;
                /** @description ID of the instance the file belongs to. Omitted for files that are not tied to an instance. */
                instance_id?: string;
                /** @description ID of the agent the file belongs to. Omitted for files that are not tied to an agent. */
                agent_id?: string;
                /** @description ID of the agent operation that generated the file. Set only when `source` is `runtime_generated`. */
                operation_id?: string;
                /** @description Current display name of the instance, filled in when the file is returned. Omitted for files without an instance. */
                instance_name?: string;
                /** @description Current display name of the agent, filled in when the file is returned. Omitted for files without an agent. */
                agent_name?: string;
                /** @description URL of the agent avatar. Omitted for files without an agent. */
                avatar_url?: string;
                /** @description Harness the instance runs, for example `openclaw`. Omitted for files without an instance. */
                harness?: string;
                /** @description True when the instance has been terminated or deleted. The file stays available. Omitted when false. */
                destroyed?: boolean;
                /** @description Number of ready files in this group. */
                count: number;
            }[];
        };
        AgentAgent: {
            /** @description ID of the agent. */
            id: string;
            /** @description ID of the instance the agent runs on. */
            instance_id: string;
            /** @description Name of the agent. */
            name: string;
            /** @description URL of the agent's avatar image. Omitted when none is set. */
            avatar_url?: string;
            /** @description Human-readable name of the agent. Omitted when none is set. */
            display_name?: string;
            /** @description Description of the agent. Empty when none is set. */
            description: string;
            /** @description Version of the agent to send as `If-Match`, in double quotes, when you update it. The same value is returned in the `ETag` header when you read or update a single agent. */
            resource_version: number;
            /** @description Whether the agent is currently provided by its instance. */
            status: string;
            /** @description Which callers other than the owner can use the agent. Change it with the update operation. */
            visibility: string;
            /** @description Whether the agent is published as a tool through BeeOS MCP endpoints. */
            mcp_enabled: boolean;
            /** @description Whether the agent accepts Agent-to-Agent (A2A) requests. When false, A2A requests for the agent are refused with 403 `a2a_disabled`. */
            a2a_enabled: boolean;
            /** @description Features the agent supports, as an object that maps a feature name to true or false. Known names include `canvas`, `terminal`, `webSsh`, `fileSystem`, `image`, `audio`, `mcp`, `cron`, `streaming`, `pushNotifications`, `a2a`, `extendedAgentCard`, `multipleConversations`, `loadConversation`, `createConversation`, `modelsList`, `modelsSet`, `skillsList`, `skillsInstall`, `skillsUninstall`, `skillsUpdate` and `automationWake`. A name that is absent or false means the agent does not support the feature. New names can be added, so ignore names you do not know. */
            capabilities: {
                [key: string]: boolean;
            };
            /** @description Skills of the agent. */
            skills: components["schemas"]["AgentSkill"][];
            /** @description How conversation messages reach the agent. New values can be added, so ignore values you do not know. */
            conversation_transport: string;
            /**
             * Format: date-time
             * @description Time the agent was created, in RFC 3339 format.
             */
            created_at: string;
            /**
             * Format: date-time
             * @description Time the agent was last changed, in RFC 3339 format.
             */
            updated_at: string;
        };
        A2AMessage: {
            /** @description ID of the message. The server generates a new ID for every message it renders. */
            messageId: string;
            /** @description Who wrote the message: `ROLE_USER` for the caller or `ROLE_AGENT` for the agent. */
            role: string;
            /** @description Content of the message as parts, in order. Each part is a text part, a file part or a data part. */
            parts: components["schemas"]["A2AOutputPart"][];
            /** @description ID of the context (conversation) the message belongs to. Omitted when it is not set. */
            contextId?: string;
            /** @description ID of the task the message belongs to. Omitted when it is not set. */
            taskId?: string;
            /** @description IDs of other tasks this message refers to. Omitted when there are none. */
            referenceTaskIds?: string[];
            /** @description Extra metadata attached to the message. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2ATaskStatus: {
            /** @description Current state of the task. */
            state: string;
            /** @description Message that explains the state, such as an error text. It is an agent message with one text part. Omitted when there is nothing to report. */
            message?: components["schemas"]["A2AMessage"] | null;
            /** @description Time of the last update of the task, or its creation time when it was never updated, as a UTC timestamp such as `2026-01-02T15:04:05.000Z`. */
            timestamp?: string;
        };
        A2AArtifact: {
            /** @description ID of the artifact. When the agent supplies none, the server uses `<task ID>-a<index>`, counting from 0. */
            artifactId: string;
            /** @description Display name of the artifact. Omitted when it is not set. */
            name?: string;
            /** @description Description of the artifact. Omitted when it is not set. */
            description?: string;
            /** @description Content of the artifact as parts, in order. Each part is a text part, a file part or a data part. */
            parts: components["schemas"]["A2AOutputPart"][];
            /** @description Extra metadata attached to the artifact. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
            /** @description URIs of the protocol extensions that apply to the artifact. Omitted when there are none. */
            extensions?: string[];
        };
        A2ATextPartOut: {
            /** @description Text content of the part. */
            text: string;
            /** @description Extra metadata attached to the part. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2AFilePartOut: {
            /** @description URL the file can be fetched from. Omitted when it is not set. */
            url?: string;
            /** @description Name of the file. Omitted when it is not set. */
            filename?: string;
            /** @description Media type (MIME type) of the file. Omitted when it is not set. */
            mediaType?: string;
            /** @description Extra metadata attached to the part. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2ADataPartOut: {
            /** @description Structured content of the part, as any JSON value. */
            data: JSONValue;
            /** @description Extra metadata attached to the part. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        a2aTaskView: {
            /** @description ID of the task. */
            id: string;
            /** @description ID of the context (conversation) the task belongs to. */
            contextId: string;
            /** @description Current status of the task. */
            status: components["schemas"]["A2ATaskStatus"];
            /** @description Outputs the agent produced for the task. Omitted while there are none. */
            artifacts?: components["schemas"]["A2AArtifact"][];
            /** @description Messages of the task. A single-task read returns at most `history_length` of them. When no history is stored it holds the original request as one message. Omitted when there are none. */
            history?: components["schemas"]["A2AMessage"][];
            /** @description Extra metadata of the task. Omitted when there is none. */
            metadata?: {
                [key: string]: JSONValue;
            };
            /** @description ID of the principal that submitted the task. */
            caller_principal_id: string;
            /** @description ID of the agent that submitted the task, if any. */
            caller_agent_id: string;
            /** @description ID of the owner of the submitting side. Cloud derives it from the credential's organization and app. Callers do not send an end-user id. */
            caller_owner_id: string;
            /** @description ID of the principal the task was sent to. */
            target_principal_id: string;
            /** @description ID of the agent the task was sent to. */
            target_agent_id: string;
            /** @description ID of the owner of the receiving side. */
            target_owner_id: string;
            /** @description ID of the channel that carries the streaming replies of the task. Omitted when the task does not use channel-based delivery. */
            channel_id?: string;
            /** @description Time the task was created, as a UTC timestamp such as `2026-01-02T15:04:05.000Z`. Omitted when it is not known. */
            created_at?: string;
            /** @description Time the task was last updated, in the same format as `created_at`. Omitted when it is not known. */
            updated_at?: string;
            /** @description Time the task finished, in the same format as `created_at`. Omitted until the task is finished. */
            completed_at?: string;
        };
        agentTemplateCatalogView: {
            /** @description ID of the template. Pass it as `template_id` when creating a harness from the template. */
            id: string;
            /** @description Display name of the template, in the language of `Accept-Language` when a translation exists. */
            display_name: string;
            /** @description One-line summary of what the template is for, localized like `display_name`. */
            summary: string;
            /** @description Full description of the template, localized like `display_name`. */
            description: string;
            /** @description Category the template is listed under. Use it as the `category` filter of the list operation. */
            category: string;
            /** @description Short phrase describing the personality of the agent the template creates, localized like `display_name`. */
            vibe: string;
            /** @description URL of the template icon. Empty when the template has none. */
            icon_url: string;
            /** @description URL of the template banner image. Empty when the template has none. */
            banner_url: string;
            /** @description ID of the model the template selects as the agent's primary model. */
            default_model: string;
            /** @description Tags that describe the template. */
            tags: string[];
            /** @description Harness (agent runtime) the template is applied to, for example `openclaw`. */
            harness: string;
            /** @description Version of the template package, as a semantic version such as `1.2.0`. */
            template_version: string;
        };
        agentBindWire: {
            /** @description State of the bind session. After a successful confirmation it is `bound`; a session that is still waiting for confirmation reports `pending`. */
            status: string;
            /** @description ID of the bind session. */
            bind_id?: string;
            /** @description ID of the instance created for the device. Present once the session is bound. */
            instance_id?: string;
            /** @description Public key the device registered for the session. */
            public_key?: string;
            /** @description Host name the device reported. */
            hostname?: string;
            /** @description Time the session expires, in Unix seconds. */
            expires_at?: number;
            /** @description Addresses a bound self-hosted agent connects to. Present once the session is bound. */
            runtime_binding?: components["schemas"]["bindRuntimeWire"] | null;
        };
        bindRuntimeWire: {
            /** @description ID of the instance the agent is bound to. */
            instance_id: string;
            /** @description Base URL of the API the agent connects to for agent traffic. */
            agent_gateway_url: string;
            /** @description Base URL of the API the agent connects to for messages. */
            message_service_url: string;
        };
        agentBindDetailsWire: {
            /** @description ID of the bind session. */
            bind_id: string;
            /** @description Host name the device reported. */
            hostname: string;
            /** @description First 16 characters of the device key fingerprint. Show it to the user to compare with the device. */
            fingerprint_short: string;
            /** @description Harness the device runs, as the device reported it. */
            harness: string;
            /** @description Operating system the device reported. Omitted when it did not report one. */
            os_type?: string;
            /** @description Time the session expires, in Unix seconds. */
            expires_at: number;
            /** @description State of the bind session. A session that has expired is deleted, so lookups of an expired session fail with 404 `not_found` instead. */
            status: string;
            /** @description Current server time in Unix seconds. Compare it with `expires_at` to get the remaining time without clock skew. */
            server_time: number;
        };
        portalBindWire: {
            /** @description ID of the provider that hosts the instance. Set when a new instance was created for the device. */
            provider_id?: string;
            /** @description ID of the bind session. It starts with `portal_`. */
            bind_id: string;
            /** @description Short code the user can enter on the device instead of scanning the QR code. It uses uppercase letters and digits without look-alike characters. */
            short_code: string;
            /** @description State of the portal bind session. A session that has expired is deleted, so lookups of an expired session fail with 404 `not_found` instead. */
            status: string;
            /** @description ID of the instance bound to the device. Present once the session is bound. */
            instance_id?: string;
            /** @description Time the session expires, in Unix seconds. A session is valid for 10 minutes. */
            expires_at: number;
            /** @description Display name for the instance created for the device. Defaults to `BeeRunner`. */
            name: string;
            /** @description Link to encode in the QR code the device scans. Returned only when the session is created. */
            qr_payload?: string;
            /** @description Base URL of the API the device connects to. Returned only when the session is created. */
            api_base_url?: string;
            /** @description URL of the relay the device connects through. Returned only when the session is created. */
            relay_url?: string;
            /** @description Lifecycle phase the created instance is driven toward: `running`. Set when a new instance was created for the device. */
            desired_status?: string;
            /** @description Reachability of the created instance: `unknown`, `online` or `offline`. Set when a new instance was created for the device. */
            connectivity?: string;
            /** @description Resource version of the created instance. Set when a new instance was created for the device. */
            resource_version?: number;
        };
        CreateServerInstanceInput: {
            /** @description Display name of the instance, 1 to 128 bytes, without leading or trailing whitespace. */
            name: string;
            /** @description ID of the catalog variant to create the instance from, at most 128 characters. See the instance template catalog for available variants. An unknown ID returns 404 `variant_not_found`. */
            variant_id?: string;
            /**
             * @description Harness to run in the instance. Only `openclaw` is accepted.
             * @enum {string}
             */
            harness?: "openclaw";
            /** @description Model providers and models the instance uses. Required when the variant or harness needs caller-supplied models; omit it for variants that supply their own models. Provider API keys are write-only. */
            llm?: components["schemas"]["RuntimeLLM"] | null;
        };
        ServerUsageSummary: {
            /** @description Total charge in the period, in BC micros (millionths of a BeeOS Credit, BC), as a decimal string. For example `1500000` is 1.5 BC. */
            total_bc: string;
            /** @description Number of usage records in the period. */
            total_records: number;
            /** @description Charge per category in the period, in BC micros as decimal strings, keyed by category. Categories without usage in the period are absent. */
            by_category: {
                [key: string]: string;
            };
            /** @description Charge per app in BC micros as decimal strings. Server API keys see only their own app, so this field is not returned to them. */
            by_app?: {
                [key: string]: string;
            };
            /** @description Number of usage records per category in the period, keyed by category. Categories without usage in the period are absent. */
            category_counts: {
                [key: string]: number;
            };
        };
        RuntimeInstanceStatusResult: {
            /** @description Current status of the instance. */
            data: {
                /** @description Unique ID of the instance. */
                id: string;
                /** @description Display name of the instance. */
                name: string;
                /** @description Lifecycle phase of the instance: `pending`, `provisioning`, `running`, `stopped` or `terminated`. */
                status: string;
                /** @description Lifecycle phase the instance is being driven toward: `running`, `stopped` or `terminated`. */
                desired_status: string;
                /** @description Reachability of the instance's agent: `unknown`, `online` or `offline`. */
                connectivity: string;
            };
            /** @description Lifecycle operation that this response reports on. */
            operation: components["schemas"]["RuntimeOperationSummary"];
        };
        UpdateServerInstanceInput: {
            /** @description New display name, 1 to 128 characters, without leading or trailing whitespace. Send `name`, `llm` or both. */
            name?: string;
            /** @description Replacement model providers and models. It replaces the whole existing llm block. Provider API keys are write-only. When `name` is also sent, the llm block is replaced first. */
            llm?: components["schemas"]["RuntimeLLM"];
        };
        FileShareResponse: {
            /** @description ID of the shared file. */
            file_id: string;
            /** @description Public slug of the share. Pass it to the resolve-share operation to get the file. */
            slug: string;
            /** @description Current name of the shared file. */
            filename: string;
            /** @description MIME type of the shared file. */
            content_type: string;
            /** @description Size of the shared file in bytes. */
            size_bytes: number;
            /** @description True when the share was revoked. A revoked share can no longer be resolved. Creating the share again turns it back on. */
            revoked: boolean;
        };
        ReplyShareResponse: {
            /** @description The shared reply. */
            data: {
                /** @description Public slug that identifies the share. */
                slug: string;
                /** @description Time the share was created. */
                created_at: string;
                /** @description The agent that wrote the reply. */
                agent: {
                    /** @description Display name of the agent. */
                    name: string;
                    /** @description URL of the agent's avatar. */
                    avatar_url: string;
                    /** @description Agent framework of the instance the agent runs on. */
                    framework: string;
                };
                /** @description The shared reply. */
                reply: {
                    /** @description Content of the reply. It holds one part of type `text`. */
                    parts: {
                        /** @description Always `text`. */
                        type: string;
                        /** @description Text of the reply. */
                        text: string;
                    }[];
                    /** @description Time the reply message was created. */
                    created_at: string;
                };
                /** @description Web sources the reply cites. Only `https` sources are listed. Each source is returned with `url`, `domain` (its host name) and, when the agent provided one, `title`. */
                sources: {
                    /** @description URL of the source. */
                    url?: string;
                    /** @description Title of the source, when the agent provided one. */
                    title?: string;
                }[];
                /** @description Files the reply links to. Only files published by BeeOS are listed. Each file is returned with `name`, `public_url` and, when known, `mime_type`. */
                files: {
                    /** @description Reserved. The server does not currently return this field; a file is identified by `public_url`. */
                    file_id?: string;
                    /** @description Reserved. The server does not currently return this field; the file name is returned as `name`. */
                    filename?: string;
                    /** @description Reserved. The server does not currently return this field; the MIME type is returned as `mime_type`. */
                    content_type?: string;
                    /** @description Reserved. The server does not currently return this field. */
                    size_bytes?: number;
                }[];
            };
        };
        ConnectURLResponse: {
            /** @description Connection details for the requested service. */
            data: {
                /** @description URL to connect to. For `browser` it is the browser viewer URL; for `acp` it is a WebSocket URL that already carries the access ticket as a query parameter. */
                url: string;
                /** @description Connection mode: `browser-runtime` for `browser`, `service-websocket` for `acp`. */
                mode: string;
                /** @description Short-lived access token for the browser viewer. Not returned for `acp`. */
                token: string;
                /** @description Service the URL connects to: `browser` or `acp`. */
                service: string;
                /** @description Reachability of the instance's agent: `unknown`, `online` or `offline`. */
                connectivity: string;
                /** @description ID of the viewing client session, the `client_id` sent in the request. Not returned for `acp`. */
                stream_session_id: string;
                /** @description Browser access grant. Returned only for `browser`. */
                browser?: {
                    /** @description ID of the browser access grant. */
                    grant_id: string;
                    /** @description Generation of the browser the grant is bound to. When `generation` was sent in the request, it equals that value. */
                    generation: string;
                    /** @description Time the access grant expires, in Unix milliseconds. */
                    expires_at: string;
                    /** @description Access role of the grant: `viewer` or `controller`. */
                    role: string;
                };
            };
        };
        ProtoAutomationRule: {
            /** @description Unique ID of the automation. */
            id?: string;
            /** @description Display name of the automation. */
            name?: string;
            /** @description Text sent to the agent on every run. */
            prompt?: string;
            /** @description Agent the prompt is sent to. */
            target?: components["schemas"]["ProtoAutomationTarget"];
            /** @description When the automation runs. Empty (`kind` unset) for `webhook` automations. */
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            /** @description How runs choose their conversation. Automations created through this API always use `new`. */
            session?: components["schemas"]["ProtoAutomationSession"];
            /**
             * Format: date-time
             * @description Earliest time a run may start, as an RFC 3339 timestamp, inclusive. Null when there is no lower bound.
             */
            validFrom?: string;
            /**
             * Format: date-time
             * @description Latest time a run may start, as an RFC 3339 timestamp, inclusive. Null when there is no upper bound.
             */
            validUntil?: string;
            /** @description State of the automation. */
            status?: string;
            /**
             * Format: date-time
             * @description Time of the next scheduled run, as an RFC 3339 timestamp. Null when the automation is paused or expired and for `webhook` automations.
             */
            nextFireAt?: string;
            /** @description ID of the conversation the automation was created from. Empty when it was not created from a conversation. */
            createdInConversationId?: string;
            /**
             * Format: date-time
             * @description Time the automation was created, as an RFC 3339 timestamp.
             */
            createdAt?: string;
            /**
             * Format: date-time
             * @description Time the automation was last changed, as an RFC 3339 timestamp.
             */
            updatedAt?: string;
            /** @description What starts a run. Automations created before webhook triggers existed can report an empty value; treat it as `schedule`. */
            triggerKind?: string;
            /** @description ID of the endpoint that receives the events of a `webhook` automation. Empty for `schedule` automations and for Gmail automations. */
            hookId?: string;
            /** @description Platform that sends the events of a `webhook` automation, for example `github` or `gmail`. Empty for `schedule` automations. */
            source?: string;
            /** @description Event type that starts a run of a `webhook` automation. Empty when every event starts a run. */
            eventFilter?: string;
            /** @description Gmail address a `webhook` automation watches. Empty for other sources. */
            mailbox?: string;
        };
        ProtoAutomationTarget: {
            /** @description ID of the instance the automation runs on. */
            instanceId?: string;
            /** @description ID of the agent that receives the prompt. It must be an active agent of `instanceId` in your app. Required. */
            agentId?: string;
        };
        ProtoAutomationSchedule: {
            /** @description Type of the schedule. It decides which of the other fields are required. */
            kind?: string;
            /** @description IANA time zone name, for example `Asia/Shanghai`. Required for every kind; `Local` is not accepted. */
            tz?: string;
            /**
             * Format: date-time
             * @description Time of the single run, as an RFC 3339 timestamp. Required when `kind` is `at`; not allowed for other kinds.
             */
            at?: string;
            /** @description Seconds between runs, as a decimal string. Required and greater than 0 when `kind` is `every`; not allowed for other kinds. */
            intervalSeconds?: string;
            /**
             * Format: date-time
             * @description Time the interval is counted from, as an RFC 3339 timestamp: runs fall on `anchorAt` plus whole multiples of the interval. When creating an `every` schedule it defaults to the creation time; when replacing a schedule it is required. Not allowed for other kinds.
             */
            anchorAt?: string;
            /** @description Five-field cron expression: minute, hour, day of month, month and day of week. Required when `kind` is `cron`; not allowed for other kinds. */
            expression?: string;
        };
        ProtoAutomationSession: {
            /** @description How a run chooses the conversation it is delivered into. */
            mode?: string;
            /** @description ID of the conversation runs are delivered into. Set only when `mode` is `bound`; empty otherwise. */
            boundConversationId?: string;
        };
        ProtoAutomationInput: {
            /** @description Display name of the automation, 1 to 256 characters and not blank. */
            name?: string;
            /** @description Text sent to the agent on every run, up to 65536 bytes and not blank. */
            prompt?: string;
            /** @description Agent the prompt is sent to. Required. */
            target?: components["schemas"]["ProtoAutomationTarget"];
            /** @description When the automation runs. Required. */
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            /** @description Not accepted by this API: a request that includes it fails with 400 `invalid_argument`. Automations created here open a new conversation for every run. */
            session?: components["schemas"]["ProtoAutomationSession"];
            /**
             * Format: date-time
             * @description Earliest time a run may start, as an RFC 3339 timestamp, inclusive. Omit it for no lower bound. It must not be after `validUntil`.
             */
            validFrom?: string;
            /**
             * Format: date-time
             * @description Latest time a run may start, as an RFC 3339 timestamp, inclusive. Omit it for no upper bound. After it the automation becomes `expired`.
             */
            validUntil?: string;
            /** @description ID of the conversation the automation is created from, if any. It must be a conversation of the same end user. */
            createdInConversationId?: string;
        };
        ProtoListAutomationsResponse: {
            /** @description Automations on this page. */
            items?: components["schemas"]["ProtoAutomationRule"][];
            /** @description Cursor to pass as `cursor` to get the next page. Empty when there are no more automations. */
            nextCursor?: string;
        };
        ProtoAutomationPatch: {
            /** @description New display name, 1 to 256 characters and not blank. */
            name?: string;
            /** @description New prompt sent to the agent on every run, up to 65536 bytes and not blank. */
            prompt?: string;
            /** @description New agent the prompt is sent to. */
            target?: components["schemas"]["ProtoAutomationTarget"];
            /** @description New schedule. It replaces the whole schedule, so send every field the `kind` needs, including `anchorAt` for `every`. */
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            /** @description Not accepted by this API: a request that includes it fails with 400 `invalid_argument`. */
            session?: components["schemas"]["ProtoAutomationSession"];
            /**
             * Format: date-time
             * @description New earliest time a run may start, as an RFC 3339 timestamp, inclusive. Cannot be combined with `clearValidFrom`.
             */
            validFrom?: string;
            /**
             * Format: date-time
             * @description New latest time a run may start, as an RFC 3339 timestamp, inclusive. Cannot be combined with `clearValidUntil`.
             */
            validUntil?: string;
            /** @description Set to true to remove the lower bound of the validity period. Cannot be combined with `validFrom`. */
            clearValidFrom?: boolean;
            /** @description Set to true to remove the upper bound of the validity period. Cannot be combined with `validUntil`. */
            clearValidUntil?: boolean;
        };
        ProtoAutomationRun: {
            /** @description Unique ID of the run. */
            id?: string;
            /** @description ID of the automation the run belongs to. */
            automationId?: string;
            /** @description What created the run. */
            triggerType?: string;
            /**
             * Format: date-time
             * @description Time the run was due, as an RFC 3339 timestamp: the scheduled time for scheduled runs, the time of the request or event for the others.
             */
            scheduledAt?: string;
            /**
             * Format: date-time
             * @description Time the run was created, as an RFC 3339 timestamp.
             */
            createdAt?: string;
            /** @description Delivery state of the run. It tells whether the prompt reached the agent's conversation, not whether the agent finished the work. */
            status?: string;
            /** @description Agent the run delivers to, copied from the automation when the run was created. */
            target?: components["schemas"]["ProtoAutomationTarget"];
            /** @description How the run chooses its conversation, copied from the automation when the run was created. A rerun sets it from `rerunSessionMode`. */
            session?: components["schemas"]["ProtoAutomationSession"];
            /** @description ID of the conversation the prompt is delivered into. Empty until the run is bound to a conversation. */
            conversationId?: string;
            /** @description ID of the conversation message that carries the prompt. It equals the run `id`. */
            wakeMessageId?: string;
            /** @description ID of the run this run repeats. Set only for reruns. */
            sourceRunId?: string;
            /** @description Which conversation a rerun is delivered into. Empty for runs that are not reruns. */
            rerunSessionMode?: string;
            /** @description Why a run was skipped or failed, or is unconfirmed. Empty otherwise and after the prompt was accepted. Skip reasons include `outside_validity`, `missed_schedule` (the run was not delivered within its window), `automation_paused`, `automation_deleted` and `preparation_stale` (the agent or session of the automation changed after the run was created). A failed run carries an API error code such as `target_not_found`, `permission_denied`, `conversation_unavailable` or `dependency_unavailable`. `dispatch_unconfirmed` means delivery started and its outcome is unknown. New codes can be added, so ignore codes you do not know. */
            reasonCode?: string;
            /**
             * Format: date-time
             * @description Time the prompt was accepted, as an RFC 3339 timestamp. Null until `status` is `dispatched`.
             */
            dispatchedAt?: string;
        };
        ProtoAutomationRunInput: {
            /** @description ID of an earlier run of the same automation to repeat. Send it together with `rerunSessionMode`, or send neither for a plain manual run. */
            sourceRunId?: string;
            /** @description Which conversation the rerun is delivered into. Required when `sourceRunId` is sent and not allowed without it. */
            rerunSessionMode?: string;
        };
        ProtoListAutomationRunsResponse: {
            /** @description Runs on this page. */
            items?: components["schemas"]["ProtoAutomationRun"][];
            /** @description Cursor to pass as `cursor` to get the next page. Empty when there are no more runs. */
            nextCursor?: string;
        };
        ProtoAutomationWebhookInput: {
            /** @description Display name of the automation, 1 to 256 characters and not blank. */
            name?: string;
            /** @description Text sent to the agent on every run, up to 65536 bytes and not blank. */
            prompt?: string;
            /** @description Agent the prompt is sent to. Required. */
            target?: components["schemas"]["ProtoAutomationTarget"];
            /** @description Not accepted by this API: a request that includes it fails with 400 `invalid_argument`. Automations created here open a new conversation for every run. */
            session?: components["schemas"]["ProtoAutomationSession"];
            /**
             * Format: date-time
             * @description Earliest time a run may start, as an RFC 3339 timestamp, inclusive. Omit it for no lower bound.
             */
            validFrom?: string;
            /**
             * Format: date-time
             * @description Latest time a run may start, as an RFC 3339 timestamp, inclusive. Omit it for no upper bound.
             */
            validUntil?: string;
            /** @description ID of the conversation the automation is created from, if any. It must be a conversation of the same end user. */
            createdInConversationId?: string;
            /** @description Platform that sends the events, for example `github` or `gmail`, at most 64 characters without whitespace. The agent must have the matching connector set up. Required. */
            source?: string;
            /** @description Names of the events to subscribe to at the source, for example the GitHub event types the repository should deliver. */
            events?: string[];
            /** @description Owner of the repository to watch. Required when `source` is `github`. */
            repoOwner?: string;
            /** @description Name of the repository to watch. Required when `source` is `github`. */
            repoName?: string;
            /** @description Event type that starts a run. When set, only events of exactly this type start a run; others are skipped. Empty accepts every event. */
            eventFilter?: string;
            /** @description Gmail address to watch. Required when `source` is `gmail`; leave empty for other sources. */
            mailbox?: string;
        };
        /** @description JSON-RPC 2.0 response. It carries `result` on success and `error` on failure, never both. Errors are returned with HTTP status 200. */
        RuntimeMethodResponse: {
            /**
             * @description JSON-RPC protocol version: always `2.0`.
             * @enum {string}
             */
            jsonrpc: "2.0";
            /** @description ID of the request that this response answers. It is `null` when the request could not be read. */
            id: string | number | null;
            /** @description Result of the method. Present only on success; its shape depends on the method. */
            result?: JSONValue;
            /** @description Error of the call. Present only on failure. */
            error?: {
                /** @description Error code. `-32700` parse error, `-32600` invalid request, `-32601` method not found, `-32602` invalid params, `-32603` internal error, `-32001` task not found, `-32002` task not cancelable, `-32003` push notifications not supported, `-32004` unsupported operation, `-32005` content type not supported, `-32006` invalid agent response, `-32007` agent card not configured, `-32008` agent busy, `-32009` incompatible `A2A-Version`, `-32010` the connection dropped after the task was dispatched (read the task instead of sending it again), `-32011` task timed out, `-32012` the connection dropped before dispatch (nothing ran; safe to retry). */
                code: number;
                /** @description Human-readable description of the error. */
                message: string;
                /** @description Machine-readable detail of the error: a list with one object of type `type.googleapis.com/google.rpc.ErrorInfo`. Its `reason` is the error name, for example `TASK_NOT_FOUND`, and its `metadata` repeats the `code` and `message`. */
                data?: JSONValue;
            };
        };
        CanvasShare: {
            /** @description Unique ID of the share. */
            id: string;
            /** @description ID of the canvas that is shared. A canvas has at most one share. */
            canvasId: string;
            /** @description Public identifier of the share, used to build the share link. It stays the same when the share is updated. */
            slug: string;
            /** @description How visitors get access. `password` requires visitors to enter the password set when the share was created. Any other value, for example `link`, lets anyone who has the link open the canvas. */
            mode: string;
            /** @description Whether visitors can interact with the canvas. When false, visitors can only view it. */
            allowInteraction: boolean;
            /** @description Time the share stops working, as an RFC 3339 timestamp. Omitted when the share does not expire; shares created through this API never expire. */
            expiresAt?: string;
            /** @description Time the share was first created, as an RFC 3339 timestamp. Updating the share does not change it. */
            createdAt: string;
        };
        CanvasSnapshot: {
            /** @description Unique ID of the snapshot. Pass it to the restore operation. */
            id: string;
            /** @description ID of the canvas the snapshot belongs to. */
            canvasId: string;
            /** @description Content of the canvas when the snapshot was taken, as base64-encoded JSON: an array of surfaces, each with `surfaceId`, `presentation`, `components` and `root`. Omitted when no content was captured. */
            componentsSnapshot?: string;
            /** @description Kind of actor that made most of the changes recorded by the snapshot: `user` for a person (restore points are also recorded as `user`), `agent` for an agent, or `system` for an automatic snapshot with no known actor. */
            actorType: string;
            /** @description ID of the actor named by `actorType`. `system` for automatic snapshots with no known actor. */
            actorId: string;
            /** @description Short note about the snapshot, for example `Auto-snapshot` for automatic snapshots or `Restored from v3` for a restore point. Omitted when there is none. */
            description?: string;
            /** @description Version of the canvas content the snapshot records. A higher number is newer. */
            version: number;
            /** @description Time the snapshot was taken, as an RFC 3339 timestamp. */
            createdAt: string;
        };
        A2AAgentCard: {
            /** @description Display name of the agent. */
            name: string;
            /** @description Description of the agent. */
            description: string;
            /** @description URL of the agent's JSON-RPC endpoint. Returned only when the request sends `A2A-Version: 0.3`; version 1.0 lists the endpoint in `supportedInterfaces`. */
            url?: string;
            /** @description Version of the agent: its resource version, a decimal number. */
            version: string;
            /** @description A2A protocol version spoken at `url`. Returned only when the request sends `A2A-Version: 0.3`. */
            protocolVersion?: string;
            /** @description Media types the agent accepts as input, for example `text/plain`. */
            defaultInputModes: string[];
            /** @description Media types the agent produces as output, for example `text/plain`. */
            defaultOutputModes: string[];
            /** @description Interfaces through which the agent can be reached. Returned unless the request sends `A2A-Version: 0.3`. */
            supportedInterfaces?: {
                /** @description URL of the interface. */
                url: string;
                /** @description Transport the interface uses: `JSONRPC`. */
                protocolBinding: string;
                /** @description A2A protocol version the interface speaks. */
                protocolVersion: string;
            }[];
        };
        /** @description One piece of content in a message or artifact. It is a text part (`text`), a file part (`url`, `filename`, `mediaType`) or a data part (`data`); which one is told by the field it carries. */
        A2AOutputPart: components["schemas"]["A2ATextPartOut"] | components["schemas"]["A2AFilePartOut"] | components["schemas"]["A2ADataPartOut"];
        RealtimeTicketHeader: {
            /** @description Signature algorithm of the ticket: `RS256`. */
            alg: string;
            /** @description Token type: `JWT`. */
            typ: string;
            /** @description ID of the key that signed the ticket. */
            kid: string;
        };
        TerminalTicketClaims: {
            /** @description Issuer of the ticket. */
            iss: string;
            /** @description Audience the ticket is intended for: the terminal service. */
            aud: string;
            /** @description Unused. Cloud does not accept an external user id, so this claim is empty. */
            sub: string;
            /** @description Unique ID of the ticket. */
            jti: string;
            /** @description ID of the instance the terminal belongs to. */
            instance_id: string;
            /** @description ID of the agent the terminal session is for, the `platformAgentId` of the request. */
            platform_agent_id: string;
            /** @description ID generated for this terminal client connection. */
            client_id: string;
            /** @description ID of the conversation the terminal is attached to. Present only when the request sent `conversationId`. */
            conversation_id?: string;
            /** @description ID of the terminal to resume. Present only when the request sent `resumeTerminalId`. */
            resume_terminal_id?: string;
            /** @description Time the ticket was issued, in Unix seconds. */
            iat: number;
            /** @description Time the ticket expires, in Unix seconds. */
            exp: number;
        };
        CanvasTicketClaims: {
            /** @description Issuer of the ticket. */
            iss: string;
            /** @description Unused. Cloud does not accept an external user id, so this claim is empty. */
            sub: string;
            /** @description Unique ID of the ticket. */
            jti: string;
            /** @description Purpose of the ticket: always `canvas_session`. */
            purpose: string;
            /** @description ID of the instance the canvas belongs to. */
            instance_id: string;
            /** @description ID of the agent the canvas session is for, the `platformAgentId` of the request. */
            platform_agent_id: string;
            /** @description ID generated for this relay client connection. */
            client_id: string;
            /** @description ID of the conversation the canvas belongs to, the `conversationId` of the request. */
            conversation_id: string;
            /** @description ID of the canvas the ticket grants access to. */
            canvas_id: string;
            /** @description Access role granted on the canvas: `viewer` or `editor`. */
            role: string;
            /** @description ID of the realtime session created for this ticket. */
            session_id: string;
            /** @description Audiences the ticket is intended for: the canvas relay. */
            aud: string[];
            /** @description Time the ticket was issued, in Unix seconds. */
            iat: number;
            /** @description Time the ticket expires, in Unix seconds. */
            exp: number;
        };
        TerminalSessionDocument: {
            /** @description How the ticket connects: always `service-websocket`. */
            transport: string;
            /** @description Version of the ticket protocol. Currently 1. */
            protocolVersion: number;
            /** @description Header of the signed ticket. */
            header: components["schemas"]["RealtimeTicketHeader"];
            /** @description WebSocket URL to open the terminal connection on. It already carries the ticket as a query parameter. */
            websocketUrl: string;
            /** @description Signed single-use ticket (a JWT) that authorizes one terminal connection. It is valid for 60 seconds. */
            ticket: string;
            /**
             * Format: date-time
             * @description Time the ticket was issued, as an RFC 3339 timestamp.
             */
            issuedAt: string;
            /**
             * Format: date-time
             * @description Time the ticket expires, as an RFC 3339 timestamp. Tickets are valid for 60 seconds.
             */
            expiresAt: string;
            /** @description Claims contained in the signed ticket. */
            claims: components["schemas"]["TerminalTicketClaims"];
        };
        CanvasSessionDocument: {
            /** @description How the ticket connects: always `relay`. */
            transport: string;
            /** @description Version of the ticket protocol. Currently 1. */
            protocolVersion: number;
            /** @description Header of the signed ticket. */
            header: components["schemas"]["RealtimeTicketHeader"];
            /** @description WebSocket URL of the canvas relay for the canvas, ending in `/ws/{canvasId}`. */
            relayUrl: string;
            /** @description Signed single-use ticket (a JWT) that authorizes one relay connection. It is valid for 60 seconds. */
            ticket: string;
            /**
             * Format: date-time
             * @description Time the ticket was issued, as an RFC 3339 timestamp.
             */
            issuedAt: string;
            /**
             * Format: date-time
             * @description Time the ticket expires, as an RFC 3339 timestamp. Tickets are valid for 60 seconds.
             */
            expiresAt: string;
            /** @description Claims contained in the signed ticket. */
            claims: components["schemas"]["CanvasTicketClaims"];
        };
        DeviceBindingErrorResponse: {
            /** @description Machine-readable error code. Device-bind routes return `invalid_request`, `unauthorized`, `not_found`, `conflict`, `binding_unavailable` or `bridge_unavailable`. Other codes can be returned for authentication and instance errors, so ignore codes you do not know. */
            error: string;
            /** @description Human-readable explanation of the error. Do not parse it. */
            message: string;
        };
        UHPCreateResponseJSONRequest: {
            /** @description A bare string is shorthand for one user message. */
            input: string | {
                [key: string]: JSONValue;
            }[];
            /** @description Model id for this turn. Omitted means the harness default. Any requested id is dispatched as given. */
            model?: string;
            /**
             * @description Client metadata, the extension point of the Responses surface. `harness_id` selects the
             *     configured harness; `environment` names the environment this task reads, overriding the
             *     harness's (capability `environments`), refused with `environment_not_found` or
             *     `environment_not_ready` before the task starts.
             */
            metadata?: {
                /** @description ID of the harness that runs the task. Optional when exactly one harness is in scope; required when there are several. */
                harness_id?: string;
                /** @description Name of an environment for the task to read. This server does not serve environments: a non-empty value is rejected with 404 `environment_not_found`. */
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @constant */
            stream?: false;
            /** @description ID of an earlier response to continue. The new response runs in the same session. The earlier response must exist and belong to the same harness. */
            previous_response_id?: string | null;
            /** @description Instructions placed before the input text and separated from it by a line containing `---`. */
            instructions?: string;
            /**
             * @description Whether to keep the response so it can be fetched later. Defaults to true.
             * @default true
             */
            store?: boolean;
            /** @description Reserved and ignored. It is reported in `metadata.ignored_fields` of the response. */
            max_output_tokens?: number | null;
            /** @description Agent step (tool-call round) budget */
            max_step?: number | null;
            /** @description Wall-clock budget */
            timeout_seconds?: number | null;
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. A UHP harness invokes and executes tools
             *     itself and reports them in `output`; there is no input path for a tool result, so the
             *     client-executed tool loop this field implies cannot be completed by a conformant server.
             *     Configure tools on the harness instead — see Harnesses §4.1. Tasks §1.4.
             */
            tools?: {
                [key: string]: JSONValue;
            }[];
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. No values are enumerated, so any string a
             *     server recognised would be one it named itself. Tasks §1.4.
             */
            include?: string[];
            /**
             * @description When true on a request that is not streamed, the call returns at once with the response still `in_progress`; fetch the result later. Ignored when `stream` is true.
             * @default false
             */
            background?: boolean;
        } & {
            [key: string]: JSONValue;
        };
        UHPCreateResponseStreamRequest: {
            /** @description A bare string is shorthand for one user message. */
            input: string | {
                [key: string]: JSONValue;
            }[];
            /** @description Model id for this turn. Omitted means the harness default. Any requested id is dispatched as given. */
            model?: string;
            /**
             * @description Client metadata, the extension point of the Responses surface. `harness_id` selects the
             *     configured harness; `environment` names the environment this task reads, overriding the
             *     harness's (capability `environments`), refused with `environment_not_found` or
             *     `environment_not_ready` before the task starts.
             */
            metadata?: {
                /** @description ID of the harness that runs the task. Optional when exactly one harness is in scope; required when there are several. */
                harness_id?: string;
                /** @description Name of an environment for the task to read. This server does not serve environments: a non-empty value is rejected with 404 `environment_not_found`. */
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @constant */
            stream?: true;
            /** @description ID of an earlier response to continue. The new response runs in the same session. The earlier response must exist and belong to the same harness. */
            previous_response_id?: string | null;
            /** @description Instructions placed before the input text and separated from it by a line containing `---`. */
            instructions?: string;
            /**
             * @description Whether to keep the response so it can be fetched later. Defaults to true.
             * @default true
             */
            store?: boolean;
            /** @description Reserved and ignored. It is reported in `metadata.ignored_fields` of the response. */
            max_output_tokens?: number | null;
            /** @description Agent step (tool-call round) budget */
            max_step?: number | null;
            /** @description Wall-clock budget */
            timeout_seconds?: number | null;
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. A UHP harness invokes and executes tools
             *     itself and reports them in `output`; there is no input path for a tool result, so the
             *     client-executed tool loop this field implies cannot be completed by a conformant server.
             *     Configure tools on the harness instead — see Harnesses §4.1. Tasks §1.4.
             */
            tools?: {
                [key: string]: JSONValue;
            }[];
            /**
             * @description Reserved and ignored. Accepted for wire compatibility, never acted on, and reported in
             *     `metadata.ignored_fields` on the response. No values are enumerated, so any string a
             *     server recognised would be one it named itself. Tasks §1.4.
             */
            include?: string[];
            /**
             * @description When true on a request that is not streamed, the call returns at once with the response still `in_progress`; fetch the result later. Ignored when `stream` is true.
             * @default false
             */
            background?: boolean;
        } & {
            [key: string]: JSONValue;
        };
    };
    responses: {
        /** @description Missing, malformed or unknown credential */
        Unauthorized: {
            headers: {
                [name: string]: JSONValue | undefined;
            };
            content: {
                "application/json": components["schemas"]["UHPErrorEnvelope"];
            };
        };
        /**
         * @description No such object in the caller's scope. Servers return 404 rather than 403 for objects outside
         *     the caller's scope, so that an id's existence is not disclosed.
         */
        NotFound: {
            headers: {
                [name: string]: JSONValue | undefined;
            };
            content: {
                "application/json": components["schemas"]["UHPErrorEnvelope"];
            };
        };
        /** @description `session_busy` or `harness_mismatch` */
        Conflict: {
            headers: {
                [name: string]: JSONValue | undefined;
            };
            content: {
                "application/json": components["schemas"]["UHPErrorEnvelope"];
            };
        };
        /** @description `model_unavailable` or `unsupported_base` */
        UnprocessableEntity: {
            headers: {
                [name: string]: JSONValue | undefined;
            };
            content: {
                "application/json": components["schemas"]["UHPErrorEnvelope"];
            };
        };
        /** @description `rate_limited` or `quota_exhausted` */
        RateLimited: {
            headers: {
                "Retry-After"?: string;
                [name: string]: JSONValue | undefined;
            };
            content: {
                "application/json": components["schemas"]["UHPErrorEnvelope"];
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: {
        /** @description The protocol version actually used to serve this response. */
        UHPVersion: string;
    };
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    setConversationApprovalMode: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the conversation the change is based on: its `resource_version` in double quotes, for example `"3"`. A different current version returns 412 `resource_version_conflict`; a missing header returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ApprovalModeSettings"];
            };
        };
        responses: {
            /** @description Approval mode desired state confirmed */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ApprovalModeResultResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    setConversationReasoning: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the conversation the change is based on: its `resource_version` in double quotes, for example `"3"`. A different current version returns 412 `resource_version_conflict`; a missing header returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ReasoningSettings"];
            };
        };
        responses: {
            /** @description Reasoning desired state confirmed */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ReasoningResultResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createClientSession: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ClientSessionInput"];
            };
        };
        responses: {
            /** @description Short-lived client token */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ClientSessionResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    refreshClientSession: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the client session, the `session_id` returned when it was created. */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    /** @description Operations the new token may perform. Each must already be granted to the session; the new set can only be equal or narrower. Omit it to keep the current capabilities. Names are listed on `requested_capabilities` of the create operation. */
                    requested_capabilities?: string[];
                    /**
                     * @description Requested token lifetime in seconds for this issuance. Explicit values outside 60..1800 return 400 invalid_request.
                     * @default 600
                     */
                    ttl_seconds?: number;
                };
            };
        };
        responses: {
            /** @description Rotated JTI with equal or narrower capabilities */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ClientSessionResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    revokeClientSession: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the client session, the `session_id` returned when it was created. */
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Session revoked or already revoked */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteExternalUser: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the end user whose stored data is deleted. 1 to 128 characters; `.` and `..` are rejected. This is the path resource id, not a request header. */
                externalUserId: components["schemas"]["ExternalUserID"];
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Asynchronous deletion accepted */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeletionAccepted"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getExternalUserDeletion: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the end user whose stored data is deleted. 1 to 128 characters; `.` and `..` are rejected. This is the path resource id, not a request header. */
                externalUserId: components["schemas"]["ExternalUserID"];
                /** @description ID of the deletion, the `deletion_id` returned by the delete operation. */
                deletionId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deletion progress scoped to the authenticated app */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["Deletion"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listProviders: {
        parameters: {
            query?: {
                /** @description Return only providers that list this capability, for example `instance`. */
                capability?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Provider catalog */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ProviderPage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listDeployRegions: {
        parameters: {
            query?: {
                /** @description Return only regions of this provider. */
                provider_id?: string;
                /** @description `true` returns only available regions and `false` only unavailable ones. Any other value returns 400 `invalid_request`. */
                available?: boolean;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deploy regions */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RegionPage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listDeployModels: {
        parameters: {
            query?: {
                /** @description Not supported: sending it returns 400 `invalid_request`. */
                harness?: string;
                /** @description Case-insensitive substring match on the model name. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deploy models */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ModelPage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listInstanceTemplates: {
        parameters: {
            query?: {
                /** @description 1-based page number, from 1 to 1000000. Defaults to 1. */
                page?: number;
                /** @description Number of templates per page, from 1 to 100. Defaults to 50. */
                page_size?: number;
                /** @description Not supported: sending it returns 400 `invalid_request`. */
                harness?: string;
                /** @description Not supported: sending it returns 400 `invalid_request`. */
                provider_id?: string;
                /** @description Not supported: sending it returns 400 `invalid_request`. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Instance templates */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["InstanceTemplatePage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstanceTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance template. */
                templateId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Instance template */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["InstanceTemplate"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listAgentTemplates: {
        parameters: {
            query?: {
                /** @description Return only templates in this category, at most 128 characters. It must equal the `category` of the template. */
                category?: string;
                /** @description Case-insensitive substring match on the template's display name or summary, at most 256 characters. */
                search?: string;
                /** @description 1-based page number, from 1 to 1000000. Defaults to 1. */
                page?: number;
                /** @description Number of templates per page, from 1 to 100. Defaults to 50. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["agentTemplateCatalogView"][];
                        total: number;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listInstances: {
        parameters: {
            query?: {
                /** @description 1-based page number, from 1 to 1000000. Defaults to 1. */
                page?: number;
                /** @description Number of instances per page, from 1 to 100. Defaults to 20. */
                page_size?: number;
                /** @description Return only instances in this lifecycle phase: `pending`, `provisioning`, `running`, `stopped` or `terminated`. When omitted, terminated instances are not returned. */
                status?: string;
                /** @description Return only instances hosted by this provider, at most 128 characters. */
                provider_id?: string;
                /** @description Return only instances that run this product harness (for example `openclaw`), at most 128 characters. */
                harness?: string;
                /** @description Return only instances deployed to this cluster, at most 128 characters. */
                cluster_id?: string;
                /** @description Case-insensitive substring match on the instance name or ID, at most 200 characters. */
                search?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Tenant-scoped result */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["InstancePage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    instanceCreate: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 256 bytes without leading or trailing whitespace. Repeating a request with the same key and body replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateServerInstanceInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstance: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteInstance: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 256 bytes without leading or trailing whitespace. Repeating a request with the same key and body replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
                /** @description Version of the instance the request applies to: the `resource_version` of the representation you last read, optionally in quotes. A stale version returns 412 `version_mismatch`; a missing or invalid one returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    updateInstanceMetadata: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the instance the request applies to: the `resource_version` of the representation you last read, optionally in quotes. A stale version returns 412 `version_mismatch`; a missing or invalid one returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateServerInstanceInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        data: components["schemas"]["RuntimeInstanceSummary"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstanceStatus: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceStatusResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    startInstance: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 256 bytes without leading or trailing whitespace. Repeating a request with the same key and body replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
                /** @description Version of the instance the request applies to: the `resource_version` of the representation you last read, optionally in quotes. A stale version returns 412 `version_mismatch`; a missing or invalid one returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    stopInstance: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 256 bytes without leading or trailing whitespace. Repeating a request with the same key and body replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
                /** @description Version of the instance the request applies to: the `resource_version` of the representation you last read, optionally in quotes. A stale version returns 412 `version_mismatch`; a missing or invalid one returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeInstanceResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    upgradeInstance: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 256 bytes without leading or trailing whitespace. Repeating a request with the same key and body replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description ID of the published platform image to upgrade to. Send at least one of `image_id`, `image_ref` and `target_version`; they select among published platform images only. */
                    image_id?: string;
                    /** @description Pinned public reference of the published platform image to upgrade to. */
                    image_ref?: string;
                    /** @description Version of the published platform image to upgrade to. */
                    target_version?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeUpgradeJob"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstanceUpgrade: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
                /** @description ID of the upgrade job, the `job_id` returned when the upgrade was started. */
                jobId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeUpgradeJob"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listAgents: {
        parameters: {
            query?: {
                /** @description Only return agents of this instance, at most 128 characters. An instance that does not exist or is not yours returns 404. */
                instance_id?: string;
                /** @description Only return agents in this state: `active` or `inactive`. Omit it to return both. */
                status?: string;
                /** @description Only return agents with this visibility: `private`, `unlisted`, `org`, `public` or `marketplace`. Omit it to return all. */
                visibility?: string;
                /** @description Only return agents whose name, display name or description contains this text, ignoring case. At most 200 characters. */
                search?: string;
                /** @description Page number to return, starting at 1. Defaults to 1. */
                page?: number;
                /** @description Number of agents per page, 1 to 100. Defaults to 20. */
                page_size?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["AgentPage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAgent: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["AgentResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    updateAgent: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the agent the change is based on: its `resource_version` in double quotes, for example `"3"`. A different current version returns 412 `resource_version_conflict`; a missing header returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AgentPatch"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["AgentResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listAgentConversations: {
        parameters: {
            query?: {
                /** @description Cursor from `next_cursor` of the previous page. Omit it to get the first page. At most 4096 characters. */
                cursor?: string;
                /** @description Maximum number of conversations to return in one page. Defaults to 50. Values from 1 to 200 are accepted. */
                limit?: number;
                /** @description Which conversations to list: `open` for conversations that accept messages (default), `closed` for closed conversations such as deleted ones, or `all` for both. */
                state?: "open" | "closed" | "all";
            };
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authorized conversation directory */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ConversationPage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createAgentConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateConversationInput"];
            };
        };
        responses: {
            /** @description Durable conversation created or replayed */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ConversationResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getConversation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authorized conversation */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ConversationResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Conversation deleted */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    updateConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the conversation the change is based on: its `resource_version` in double quotes, for example `"3"`. A different current version returns 412 `resource_version_conflict`; a missing header returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UpdateConversationInput"];
            };
        };
        responses: {
            /** @description Conversation renamed */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ConversationResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listConversationMessages: {
        parameters: {
            query?: {
                /** @description Cursor from `next_cursor` of the previous page. Omit it to get the first page. At most 4096 characters. */
                cursor?: string;
                /** @description Maximum number of messages to return in one page. Defaults to 50. The server accepts values from 1 to 200. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authoritative message history page */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["MessagePage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getConversationMessage: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
                /** @description ID of the message. */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authoritative v3 message snapshot */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["MessageEnvelopeResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    cancelConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CancelConversationInput"];
            };
        };
        responses: {
            /** @description Cancel accepted */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["CommandReceiptResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    clearConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Clear accepted */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ClearConversationReceiptResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    setConversationModel: {
        parameters: {
            query?: never;
            header: {
                /** @description Version of the conversation the change is based on: its `resource_version` in double quotes, for example `"3"`. A different current version returns 412 `resource_version_conflict`; a missing header returns 428 `precondition_required`. */
                "If-Match": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["SetConversationModelInput"];
            };
        };
        responses: {
            /** @description Model change accepted */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["CommandReceiptResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getUsageSummary: {
        parameters: {
            query?: {
                /** @description Length of the reporting window, which ends now: `day` for the last 24 hours (default), `week` for the last 7 days or `month` for the last 30 days. The window moves with the current time and does not follow calendar days. */
                period?: "day" | "week" | "month";
                /** @description Only count usage of this category, one of the keys that appear in `by_category`. Omit it to count all categories. */
                category?: string;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ServerUsageSummary"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createTerminalSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description ID of the agent the terminal session is for, as a UUID.
                     */
                    platformAgentId: string;
                    /**
                     * Format: uuid
                     * @description ID of the conversation to attach the terminal to, as a UUID. Optional.
                     */
                    conversationId?: string;
                    /**
                     * Format: uuid
                     * @description ID of an existing terminal to resume, as a UUID. Optional.
                     */
                    resumeTerminalId?: string;
                };
            };
        };
        responses: {
            /** @description Single-use RS256 terminal ticket */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["TerminalSessionDocument"];
                };
            };
            /** @description Cloud Server error */
            400: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            401: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            404: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            429: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            "5XX": {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createCanvasSession: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * Format: uuid
                     * @description ID of the agent the canvas session is for, as a UUID.
                     */
                    platformAgentId: string;
                    /**
                     * Format: uuid
                     * @description ID of the conversation the canvas belongs to, as a UUID.
                     */
                    conversationId: string;
                    /** @description Opaque Canvas/A2UI surface identifier; not a UUID */
                    canvasId?: string;
                };
            };
        };
        responses: {
            /** @description Single-use RS256 canvas relay ticket */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["CanvasSessionDocument"];
                };
            };
            /** @description Cloud Server error */
            400: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            401: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            404: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            429: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            "5XX": {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    execInstance: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Program and arguments as an argument vector; it is never passed through a shell. 1 to 64 entries of at most 4096 bytes each and 16 KiB in total. The first entry must not be blank. */
                    argv: string[];
                    /** @description Maximum run time in seconds, from 1 to 30. */
                    timeout_seconds?: number;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeExecResult"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    presignFileUpload: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 8 to 128 characters without leading or trailing whitespace. Repeating a request with the same key and parameters replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FilePrepareUploadInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileTransferDescriptor"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    confirmFileUpload: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 8 to 128 characters without leading or trailing whitespace. Repeating a request with the same key and parameters replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["FileConfirmInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileFile"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listFiles: {
        parameters: {
            query?: {
                /** @description Return only files with exactly this MIME type, at most 255 characters. */
                content_type?: string;
                /** @description Cursor from `next_since` of the previous page. Omit it to start at the oldest file. It applies only to the default chronological listing, that is when none of `status`, `file_type`, `category`, `source`, `q`, `instance_id`, `agent_id`, `sort`, `sort_dir` and `offset` is set. At most 2048 characters. */
                since?: string;
                /** @description Return only files in this state: `ready` or `pending_upload`. When omitted, files in both states are returned. */
                status?: string;
                /** @description Return only files in this category: `FILE_TYPE_IMAGE`, `FILE_TYPE_VIDEO`, `FILE_TYPE_AUDIO`, `FILE_TYPE_DOCUMENT`, `FILE_TYPE_ARCHIVE` or `FILE_TYPE_OTHER`. */
                file_type?: string;
                /** @description Return only files in a broad category: `image`, `video`, `document` or `other`. `other` covers every file that is not an image, a video or a document, including audio and archives. */
                category?: string;
                /** @description Return only files with this origin: `manual`, `chat_upload`, `runtime_generated` or `template_skill`. Files without a recorded origin count as `manual`. */
                source?: string;
                /** @description Return only files whose name contains this text, compared case-insensitively. */
                q?: string;
                /** @description Return only files that belong to this instance. */
                instance_id?: string;
                /** @description Return only files that belong to this agent. */
                agent_id?: string;
                /** @description Field to sort by: `created_at` (the default), `updated_at`, `file_name` or `size_bytes`. Ties are ordered by file ID. Any sort, filter or `offset` switches the listing to offset paging. */
                sort?: string;
                /** @description Sort direction: `asc` or `desc`. When sorting or filtering the default is `desc`; the default chronological listing is oldest first. */
                sort_dir?: string;
                /** @description Maximum number of files to return, from 0 to 200. Defaults to 50. */
                limit?: number;
                /** @description Number of matching files to skip, 0 or more. Setting it switches the listing to offset paging. */
                offset?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FilePage"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileResolution"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteFile: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 8 to 128 characters without leading or trailing whitespace. Repeating a request with the same key and parameters replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    renameFile: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description New name of the file, 1 to 255 characters, without leading or trailing whitespace and without `/`, `\` or control characters. */
                    title: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileFile"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAgentTemplate: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent template. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["agentTemplateCatalogView"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getShareFileShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileShareResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createShareFileShare: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 8 to 128 characters without leading or trailing whitespace. Repeating a request with the same key and parameters replays the original result; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileShareResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    revokeShareFileShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the file, the `file_id` returned when the upload was prepared. */
                fileId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    resolveFileShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Public slug of the file share, the `slug` returned when the share was created. */
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        file_id: string;
                        slug: string;
                        filename: string;
                        content_type: string;
                        size_bytes: number;
                        download: components["schemas"]["FileTransferDescriptor"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getFilesSummary: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["FileSummary"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getShareReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
                /** @description ID of the message. */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        /** @description The share of the reply. */
                        data: {
                            /** @description Public slug that identifies the share. Use it to resolve the shared reply with the reply share lookup. */
                            slug: string;
                            /** @description Time the share was created. */
                            created_at: string;
                        };
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createShareReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
                /** @description ID of the message. */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        /** @description The share of the reply. */
                        data: {
                            /** @description Public slug that identifies the share. Use it to resolve the shared reply with the reply share lookup. */
                            slug: string;
                            /** @description Time the share was created. */
                            created_at: string;
                        };
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    revokeShareReply: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
                /** @description ID of the message. */
                messageId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    resolveReplyShare: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description Public slug of the shared reply, the `data.slug` returned when the share was created. */
                slug: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ReplyShareResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstanceConnectURL: {
        parameters: {
            query?: {
                /** @description Service to connect to: `browser` for a browser viewer or `acp` for an agent connection. Required. */
                service?: string;
                /** @description ID you choose for the viewing client session, 1 to 128 characters (letters, digits, `_`, `.`, `:` and `-`, starting with a letter or digit). Required when `service` is `browser`; not accepted for `acp`. */
                client_id?: string;
                /** @description Access role to request: `viewer` or `controller`. Required when `service` is `browser`; not accepted for `acp`. */
                role?: string;
                /** @description Browser generation the access grant must be bound to, in the same format as `client_id`. The request fails when the browser's current generation differs. Only for `browser`. */
                generation?: string;
            };
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ConnectURLResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getInstanceStreamURL: {
        parameters: {
            query?: {
                /** @description Viewport width in pixels, greater than 0 and below 100000. */
                viewportWidth?: number;
                /** @description Viewport height in pixels, greater than 0 and below 100000. */
                viewportHeight?: number;
                /** @description Device pixel ratio, greater than 0 and below 16. */
                dpr?: number;
            };
            header?: never;
            path: {
                /** @description ID of the instance. */
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        data: JSONValue;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    resumeConversation: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes retries of this request safe, 8 to 128 characters without leading or trailing whitespace. Retrying with the same key and the same content returns the original result; reusing the key with different content returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the agent, the `id` returned by the agents API. */
                agentId: string;
                /** @description ID of the conversation, as returned when it was created or listed. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        data: {
                            request_id: string;
                            status: string;
                        };
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listAutomations: {
        parameters: {
            query?: {
                /** @description Return only automations in this state: `enabled`, `paused` or `expired`. */
                status?: string;
                /** @description Cursor from `nextCursor` of the previous page. Omit it to get the first page. */
                cursor?: string;
                /** @description Maximum number of automations to return in one page, 1 or more, up to the server maximum (at most 1000). Larger values are rejected with 400 `invalid_argument`. Defaults to 20. */
                limit?: number;
            };
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoListAutomationsResponse"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProtoAutomationInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoAutomationRule"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: JSONValue;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    updateAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProtoAutomationPatch"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoAutomationRule"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    pauseAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: JSONValue;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    resumeAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: JSONValue;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listAutomationRuns: {
        parameters: {
            query?: {
                /** @description Return only runs in this state: `scheduled`, `dispatched`, `failed` or `skipped`. */
                status?: string;
                /** @description Cursor from `nextCursor` of the previous page. Omit it to get the first page. */
                cursor?: string;
                /** @description Maximum number of runs to return in one page, 1 or more, up to the server maximum (at most 1000). Larger values are rejected with 400 `invalid_argument`. Defaults to 20. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoListAutomationRunsResponse"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createAutomationRun: {
        parameters: {
            query?: never;
            header: {
                /** @description Key that makes the request safe to retry, 1 to 128 bytes and not blank. Repeating a request with the same key and body returns the original run; reusing the key for a different request returns 409 `idempotency_conflict`. */
                "Idempotency-Key": string;
            };
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProtoAutomationRunInput"];
            };
        };
        responses: {
            /** @description Success */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoAutomationRun"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAutomationRun: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the automation, the `id` returned when it was created. */
                automationId: string;
                /** @description ID of the run, the `id` returned when the run was created or listed. */
                runId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoAutomationRun"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createWebhookAutomation: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["ProtoAutomationWebhookInput"];
            };
        };
        responses: {
            /** @description Success */
            201: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["ProtoAutomationRule"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    transcribeAudio: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "multipart/form-data": {
                    /** Format: binary */
                    file: Blob;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: {
                            text: string;
                            duration_seconds: number;
                        };
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getShareCanvas: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the canvas, a UUID. The canvas must belong to the conversation and agent named by the headers. */
                canvasId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["CanvasShare"] | null;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    createShareCanvas: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the canvas, a UUID. The canvas must belong to the conversation and agent named by the headers. */
                canvasId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description How visitors get access: `password` to protect the share with `password`, or any other value, for example `link`, to let anyone with the link open the canvas. Required. */
                    mode: string;
                    /** @description Password visitors must enter. Used only when `mode` is `password`; without it no visitor can pass the check. */
                    password?: string;
                    /** @description Whether visitors can interact with the canvas. Defaults to true. Send false to make the share view-only. */
                    allowInteraction?: boolean;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["CanvasShare"] | null;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    deleteShareCanvas: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the canvas, a UUID. The canvas must belong to the conversation and agent named by the headers. */
                canvasId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            204: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content?: never;
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listCanvasSnapshots: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the canvas, a UUID. The canvas must belong to the conversation and agent named by the headers. */
                canvasId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["CanvasSnapshot"][];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    restoreCanvasSnapshot: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the canvas, a UUID. The canvas must belong to the conversation and agent named by the headers. */
                canvasId: string;
                /** @description ID of the snapshot to restore, as returned by the snapshot list. */
                snapshotId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: {
                            snapshotId: string;
                            canvasId: string;
                            restored: boolean;
                            version: number;
                        };
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getCanvasSession: {
        parameters: {
            query?: never;
            header: {
                /** @description ID of the conversation the canvas is used in. For the session lookup it must equal `conversationId` in the path. */
                "X-BeeOS-Conversation-ID": string;
                /** @description ID of the agent that owns the canvas. It must be an agent of `instanceId`. */
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                /** @description ID of the instance that hosts the agent. It must belong to your app. */
                instanceId: string;
                /** @description ID of the conversation to look up the canvas session for. It must equal the `X-BeeOS-Conversation-ID` header. */
                conversationId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: {
                            canvasId: string;
                            sessionId: string;
                            instanceId: string;
                            linkedAt: string;
                            role: string;
                        } | null;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getAgentBindDetails: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent bind session, the `bind_id` returned when the device created it. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["agentBindDetailsWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    confirmAgentBind: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent bind session to confirm, the `bind_id` returned when the device created it. */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Display name for the instance created for the device, up to 128 characters. Defaults to the host name the device reported. */
                    name?: string;
                    /** @description Accepted and ignored. The instance keeps the default model of the server. */
                    modelPrimary?: string;
                    /** @description Snake-case alias of `modelPrimary`, also ignored. If both are sent they must be equal. */
                    model_primary?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["agentBindWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    createPortalBind: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @description Display name for the instance created for the device, up to 128 characters. Defaults to `BeeRunner`. */
                    name?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["portalBindWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    getPortalBind: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the portal bind session, the `bind_id` returned when it was created. It starts with `portal_`. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["portalBindWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    revokePortalBind: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the portal bind session, the `bind_id` returned when it was created. It starts with `portal_`. */
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["portalBindWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    resolvePortalBind: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the portal bind session, the `bind_id` returned when it was created. It starts with `portal_`. */
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description What to do with the device that claimed the session. Required.
                     * @enum {string}
                     */
                    decision: "recover" | "create";
                    /** @description ID of the existing instance to bind the device to. Required when `decision` is `recover`; ignored for `create`. */
                    instance_id?: string;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        success: boolean;
                        data: components["schemas"]["portalBindWire"];
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["DeviceBindingErrorResponse"];
                };
            };
        };
    };
    invokeA2A: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /**
                     * @description JSON-RPC protocol version: must be `2.0`.
                     * @enum {string}
                     */
                    jsonrpc: "2.0";
                    /** @description ID of the request, echoed in the `id` of the response. */
                    id?: string;
                    /** @description A2A method to call. Each method has an A2A 1.0 name and an A2A 0.3 alias: `SendMessage` (`message/send`) sends a message to the agent and creates a task; `SendStreamingMessage` (`message/stream`) does the same and streams updates as server-sent events; `SubscribeToTask` (`tasks/resubscribe`) resumes the update stream of a task; `GetTask` (`tasks/get`), `CancelTask` (`tasks/cancel`) and `ListTasks` (`tasks/list`) read and cancel tasks; `CompleteTask` (`tasks/complete`) finishes a task with a result or an error message; `UpdateStatus` (`tasks/updateStatus`) sets the state of a task; `CreateTaskPushNotificationConfig` (`SetPushNotificationConfig`, `tasks/pushNotification/set`), `GetTaskPushNotificationConfig` (`GetPushNotificationConfig`, `tasks/pushNotification/get`), `ListTaskPushNotificationConfigs` (`ListPushNotificationConfigs`, `tasks/pushNotification/list`) and `DeleteTaskPushNotificationConfig` (`DeletePushNotificationConfig`, `tasks/pushNotification/delete`) manage push notification settings of a task. An unknown method returns error `-32601`. */
                    method: string;
                    /** @description Parameters of the method. Their shape depends on `method`, as defined by the A2A protocol. */
                    params?: JSONValue;
                };
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["RuntimeMethodResponse"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getA2AAgentCard: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["A2AAgentCard"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getA2AAgentCardLegacy: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["A2AAgentCard"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    listA2ATasks: {
        parameters: {
            query?: {
                /** @description `sent` lists tasks that the agent submitted and `received` lists tasks that were submitted to it. When omitted, both are listed. Any other value is rejected. */
                direction?: string;
                /** @description Return only tasks exchanged with this other agent, at most 128 characters. Whether it is matched as the submitter or the receiver depends on `direction`. */
                agent_id?: string;
                /** @description Opaque cursor for the next page: the `next_cursor` of the previous response, at most 4096 bytes. */
                cursor?: string;
                /** @description Number of tasks per page, from 1 to 100. Defaults to 20. */
                limit?: number;
            };
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        tasks: components["schemas"]["a2aTaskView"][];
                        total: number;
                        next_cursor: string;
                        has_more: boolean;
                    };
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getA2ATask: {
        parameters: {
            query?: {
                /** @description Maximum number of history messages to return, from 0 to 200. Defaults to 50. */
                history_length?: number;
            };
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
                /** @description ID of the task, at most 256 characters. */
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["a2aTaskView"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    cancelA2ATask: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the agent. It must belong to your app. For JSON-RPC and agent card requests the agent must also have its A2A protocol enabled, otherwise the request returns 403 `a2a_disabled`; task reads work either way. */
                agentId: string;
                /** @description ID of the task, at most 256 characters. */
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["a2aTaskView"];
                };
            };
            /** @description Cloud Server error */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["ErrorResponse"];
                };
            };
        };
    };
    getDiscovery: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The discovery document */
            200: {
                headers: {
                    "UHP-Version": components["headers"]["UHPVersion"];
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPDiscovery"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    listHarnesses: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Harnesses within the caller's scope. May be empty. */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        harnesses: components["schemas"]["UHPHarness"][];
                    };
                };
            };
            401: components["responses"]["Unauthorized"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    createHarness: {
        parameters: {
            query?: never;
            header?: {
                /** @description Key that makes a request that creates an agent safe to retry, 1 to 128 visible ASCII characters without spaces. It applies to `POST /harnesses` and to `PUT` with a `template_id`; for other updates it is ignored. Repeating a request with the same key and body continues the earlier attempt; reusing the key for a different request returns 409 `beeos_idempotency_conflict`. */
                "Idempotency-Key"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UHPHarnessCreate"];
            };
        };
        responses: {
            /** @description The created harness */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPHarness"];
                };
            };
            /** @description UHP protocol error envelope */
            400: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            /** @description UHP protocol error envelope */
            409: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            413: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            422: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            502: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            503: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            504: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    getHarness: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the harness. It starts with `chrn_`. */
                harness_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The harness */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPHarness"];
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    updateHarness: {
        parameters: {
            query?: never;
            header?: {
                /** @description Key that makes a request that creates an agent safe to retry, 1 to 128 visible ASCII characters without spaces. It applies to `POST /harnesses` and to `PUT` with a `template_id`; for other updates it is ignored. Repeating a request with the same key and body continues the earlier attempt; reusing the key for a different request returns 409 `beeos_idempotency_conflict`. */
                "Idempotency-Key"?: string;
            };
            path: {
                /** @description ID of the harness. It starts with `chrn_`. */
                harness_id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UHPHarnessCreate"];
            };
        };
        responses: {
            /** @description The updated harness */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPHarness"];
                };
            };
            /** @description UHP protocol error envelope */
            400: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            409: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            413: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            422: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            502: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            503: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            504: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    deleteHarness: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the harness. It starts with `chrn_`. */
                harness_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        id?: string;
                        deleted?: boolean;
                    };
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            422: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    listModels: {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Models grouped by backend, each with computed availability */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPModelCatalog"];
                };
            };
            401: components["responses"]["Unauthorized"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    listHarnessModels: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the harness. It starts with `chrn_`. */
                harness_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The harness's allowed models, default and authorized fallback */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPHarnessModels"];
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    createResponse: {
        parameters: {
            query?: never;
            header?: {
                /** @description Repeating a key returns the first request's result and does not re-execute. */
                "Idempotency-Key"?: string;
                /** @description Protocol version to use: `2026-10-04` (the default), `2026-09-28`, `2026-09-12` or `2026-08-11`. The version served is echoed in the same header of the response. An unsupported version is rejected with `unsupported_protocol_version`. */
                "UHP-Version"?: string;
            };
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UHPCreateResponseJSONRequest"];
            };
        };
        responses: {
            /** @description The finished Response (non-streaming), or the event stream (streaming). */
            200: {
                headers: {
                    "UHP-Version": components["headers"]["UHPVersion"];
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPResponse"];
                    "text/event-stream": string;
                };
            };
            /** @description UHP protocol error envelope */
            400: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            401: components["responses"]["Unauthorized"];
            404: components["responses"]["NotFound"];
            409: components["responses"]["Conflict"];
            422: components["responses"]["UnprocessableEntity"];
            429: components["responses"]["RateLimited"];
            /** @description UHP protocol error envelope */
            503: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    getResponse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the response. It starts with `resp_`. */
                response_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The Response */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPResponse"];
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    deleteResponse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the response. It starts with `resp_`. */
                response_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Deleted */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        /** @description ID of the deleted response. */
                        id?: string;
                        /** @description Always true. A response that cannot be deleted returns an error instead. */
                        deleted?: boolean;
                    };
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    getResponseInputItems: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the response. It starts with `resp_`. */
                response_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Input items */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": {
                        /**
                         * @description Object type of the list.
                         * @enum {string}
                         */
                        object?: "list";
                        /** @description Input items of the response, as they were sent in the request. A string `input` appears as one `message` item with role `user` and an `input_text` content part. */
                        data?: {
                            [key: string]: JSONValue;
                        }[];
                    };
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    cancelResponse: {
        parameters: {
            query?: never;
            header?: never;
            path: {
                /** @description ID of the response. It starts with `resp_`. */
                response_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description The Response, now cancelling or terminal */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPResponse"];
                };
            };
            404: components["responses"]["NotFound"];
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
    getResponseEvents: {
        parameters: {
            query?: never;
            header?: {
                /** @description Sequence number of the last event the client received. The stream resumes after it. Must be a non-negative integer. */
                "Last-Event-ID"?: string;
                /** @description Protocol version to use: `2026-10-04` (the default), `2026-09-28`, `2026-09-12` or `2026-08-11`. The version served is echoed in the same header of the response. An unsupported version is rejected with `unsupported_protocol_version`. */
                "UHP-Version"?: string;
            };
            path: {
                /** @description ID of the response. It starts with `resp_`. */
                response_id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Server-sent protocol events */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "text/event-stream": components["schemas"]["UHPEvent"];
                };
            };
            /** @description UHP protocol error envelope */
            default: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["UHPErrorEnvelope"];
                };
            };
        };
    };
}

export type ExternalUserID = components["schemas"]["ExternalUserID"];
export type ClientSessionInput = components["schemas"]["ClientSessionInput"];
export type Binding = components["schemas"]["Binding"];
export type ClientSessionResponse = components["schemas"]["ClientSessionResponse"];
export type DeletionAccepted = components["schemas"]["DeletionAccepted"];
export type Deletion = components["schemas"]["Deletion"];
export type Provider = components["schemas"]["Provider"];
export type DeployRegion = components["schemas"]["DeployRegion"];
export type DeployModel = components["schemas"]["DeployModel"];
export type InstanceTemplate = components["schemas"]["InstanceTemplate"];
export type ProviderPage = components["schemas"]["ProviderPage"];
export type RegionPage = components["schemas"]["RegionPage"];
export type ModelPage = components["schemas"]["ModelPage"];
export type InstanceSummary = components["schemas"]["InstanceSummary"];
export type InstancePage = components["schemas"]["InstancePage"];
export type ProviderCapabilities = components["schemas"]["ProviderCapabilities"];
export type CatalogSpecValue = components["schemas"]["CatalogSpecValue"];
export type CatalogSpec = components["schemas"]["CatalogSpec"];
export type CatalogVariant = components["schemas"]["CatalogVariant"];
export type InstanceTemplatePage = components["schemas"]["InstanceTemplatePage"];
export type AgentSnapshot = components["schemas"]["AgentSnapshot"];
export type AgentSkill = components["schemas"]["AgentSkill"];
export type AgentPatch = components["schemas"]["AgentPatch"];
export type AgentResponse = components["schemas"]["AgentResponse"];
export type AgentPage = components["schemas"]["AgentPage"];
export type CreateConversationInput = components["schemas"]["CreateConversationInput"];
export type Conversation = components["schemas"]["Conversation"];
export type ConversationResponse = components["schemas"]["ConversationResponse"];
export type ConversationPage = components["schemas"]["ConversationPage"];
export type Message = components["schemas"]["Message"];
export type MessagePage = components["schemas"]["MessagePage"];
export type MessageEnvelope = components["schemas"]["MessageEnvelope"];
export type MessageEnvelopeResponse = components["schemas"]["MessageEnvelopeResponse"];
export type UpdateConversationInput = components["schemas"]["UpdateConversationInput"];
export type CancelConversationInput = components["schemas"]["CancelConversationInput"];
export type SetConversationModelInput = components["schemas"]["SetConversationModelInput"];
export type CommandReceipt = components["schemas"]["CommandReceipt"];
export type CommandReceiptResponse = components["schemas"]["CommandReceiptResponse"];
export type ClearConversationReceipt = components["schemas"]["ClearConversationReceipt"];
export type ClearConversationReceiptResponse = components["schemas"]["ClearConversationReceiptResponse"];
export type ActiveConversationResponse = components["schemas"]["ActiveConversationResponse"];
export type ReasoningSettings = components["schemas"]["ReasoningSettings"];
export type ReasoningResult = components["schemas"]["ReasoningResult"];
export type ReasoningResultResponse = components["schemas"]["ReasoningResultResponse"];
export type ApprovalModeSettings = components["schemas"]["ApprovalModeSettings"];
export type ApprovalModeResult = components["schemas"]["ApprovalModeResult"];
export type ApprovalModeResultResponse = components["schemas"]["ApprovalModeResultResponse"];
export type ErrorResponse = components["schemas"]["ErrorResponse"];
export type UHPDiscovery = components["schemas"]["UHPDiscovery"];
export type UHPCapabilities = components["schemas"]["UHPCapabilities"];
export type UHPHarness = components["schemas"]["UHPHarness"];
export type UHPMcpServer = components["schemas"]["UHPMcpServer"];
export type UHPPluginMcpServer = components["schemas"]["UHPPluginMcpServer"];
export type UHPSkill = components["schemas"]["UHPSkill"];
export type UHPSkillFile = components["schemas"]["UHPSkillFile"];
export type UHPPlugin = components["schemas"]["UHPPlugin"];
export type UHPPluginManifest = components["schemas"]["UHPPluginManifest"];
export type UHPPluginSkill = components["schemas"]["UHPPluginSkill"];
export type UHPPluginSkipped = components["schemas"]["UHPPluginSkipped"];
export type UHPHarnessCreate = components["schemas"]["UHPHarnessCreate"];
export type UHPModelCatalog = components["schemas"]["UHPModelCatalog"];
export type UHPHarnessModels = components["schemas"]["UHPHarnessModels"];
export type UHPModel = components["schemas"]["UHPModel"];
export type UHPCreateResponseRequest = components["schemas"]["UHPCreateResponseRequest"];
export type UHPResponse = components["schemas"]["UHPResponse"];
export type UHPResponseStatus = components["schemas"]["UHPResponseStatus"];
export type UHPOutputItem = components["schemas"]["UHPOutputItem"];
export type UHPContentPart = components["schemas"]["UHPContentPart"];
export type UHPAnnotation = components["schemas"]["UHPAnnotation"];
export type UHPUsage = components["schemas"]["UHPUsage"];
export type UHPErrorEnvelope = components["schemas"]["UHPErrorEnvelope"];
export type UHPError = components["schemas"]["UHPError"];
export type UHPEvent = components["schemas"]["UHPEvent"];
export type RuntimeInstanceSummary = components["schemas"]["RuntimeInstanceSummary"];
export type RuntimeOperationSummary = components["schemas"]["RuntimeOperationSummary"];
export type RuntimeInstanceResult = components["schemas"]["RuntimeInstanceResult"];
export type RuntimeExecResult = components["schemas"]["RuntimeExecResult"];
export type RuntimeLLM = components["schemas"]["RuntimeLLM"];
export type RuntimeLLMView = components["schemas"]["RuntimeLLMView"];
export type RuntimeLLMProvider = components["schemas"]["RuntimeLLMProvider"];
export type RuntimeLLMProviderView = components["schemas"]["RuntimeLLMProviderView"];
export type RuntimeLLMModel = components["schemas"]["RuntimeLLMModel"];
export type RuntimeUpgradeJob = components["schemas"]["RuntimeUpgradeJob"];
export type FileFile = components["schemas"]["FileFile"];
export type FileOrigin = components["schemas"]["FileOrigin"];
export type FileTransferDescriptor = components["schemas"]["FileTransferDescriptor"];
export type FileChatUploadContext = components["schemas"]["FileChatUploadContext"];
export type FilePrepareUploadInput = components["schemas"]["FilePrepareUploadInput"];
export type FileConfirmInput = components["schemas"]["FileConfirmInput"];
export type FilePage = components["schemas"]["FilePage"];
export type FileResolution = components["schemas"]["FileResolution"];
export type FileSummary = components["schemas"]["FileSummary"];
export type AgentAgent = components["schemas"]["AgentAgent"];
export type A2AMessage = components["schemas"]["A2AMessage"];
export type A2ATaskStatus = components["schemas"]["A2ATaskStatus"];
export type A2AArtifact = components["schemas"]["A2AArtifact"];
export type A2ATextPartOut = components["schemas"]["A2ATextPartOut"];
export type A2AFilePartOut = components["schemas"]["A2AFilePartOut"];
export type A2ADataPartOut = components["schemas"]["A2ADataPartOut"];
export type a2aTaskView = components["schemas"]["a2aTaskView"];
export type agentTemplateCatalogView = components["schemas"]["agentTemplateCatalogView"];
export type agentBindWire = components["schemas"]["agentBindWire"];
export type bindRuntimeWire = components["schemas"]["bindRuntimeWire"];
export type agentBindDetailsWire = components["schemas"]["agentBindDetailsWire"];
export type portalBindWire = components["schemas"]["portalBindWire"];
export type CreateServerInstanceInput = components["schemas"]["CreateServerInstanceInput"];
export type ServerUsageSummary = components["schemas"]["ServerUsageSummary"];
export type RuntimeInstanceStatusResult = components["schemas"]["RuntimeInstanceStatusResult"];
export type UpdateServerInstanceInput = components["schemas"]["UpdateServerInstanceInput"];
export type FileShareResponse = components["schemas"]["FileShareResponse"];
export type ReplyShareResponse = components["schemas"]["ReplyShareResponse"];
export type ConnectURLResponse = components["schemas"]["ConnectURLResponse"];
export type ProtoAutomationRule = components["schemas"]["ProtoAutomationRule"];
export type ProtoAutomationTarget = components["schemas"]["ProtoAutomationTarget"];
export type ProtoAutomationSchedule = components["schemas"]["ProtoAutomationSchedule"];
export type ProtoAutomationSession = components["schemas"]["ProtoAutomationSession"];
export type ProtoAutomationInput = components["schemas"]["ProtoAutomationInput"];
export type ProtoListAutomationsResponse = components["schemas"]["ProtoListAutomationsResponse"];
export type ProtoAutomationPatch = components["schemas"]["ProtoAutomationPatch"];
export type ProtoAutomationRun = components["schemas"]["ProtoAutomationRun"];
export type ProtoAutomationRunInput = components["schemas"]["ProtoAutomationRunInput"];
export type ProtoListAutomationRunsResponse = components["schemas"]["ProtoListAutomationRunsResponse"];
export type ProtoAutomationWebhookInput = components["schemas"]["ProtoAutomationWebhookInput"];
export type RuntimeMethodResponse = components["schemas"]["RuntimeMethodResponse"];
export type CanvasShare = components["schemas"]["CanvasShare"];
export type CanvasSnapshot = components["schemas"]["CanvasSnapshot"];
export type A2AAgentCard = components["schemas"]["A2AAgentCard"];
export type A2AOutputPart = components["schemas"]["A2AOutputPart"];
export type RealtimeTicketHeader = components["schemas"]["RealtimeTicketHeader"];
export type TerminalTicketClaims = components["schemas"]["TerminalTicketClaims"];
export type CanvasTicketClaims = components["schemas"]["CanvasTicketClaims"];
export type TerminalSessionDocument = components["schemas"]["TerminalSessionDocument"];
export type CanvasSessionDocument = components["schemas"]["CanvasSessionDocument"];
export type DeviceBindingErrorResponse = components["schemas"]["DeviceBindingErrorResponse"];
export type UHPCreateResponseJSONRequest = components["schemas"]["UHPCreateResponseJSONRequest"];
export type UHPCreateResponseStreamRequest = components["schemas"]["UHPCreateResponseStreamRequest"];
export type SetConversationApprovalModeResponse = operations["setConversationApprovalMode"]["responses"][200]["content"]["application/json"];
export type SetConversationReasoningResponse = operations["setConversationReasoning"]["responses"][200]["content"]["application/json"];
export type CreateClientSessionResponse = operations["createClientSession"]["responses"][200]["content"]["application/json"];
export type RefreshClientSessionResponse = operations["refreshClientSession"]["responses"][200]["content"]["application/json"];
export type RefreshClientSessionRequest = NonNullable<operations["refreshClientSession"]["requestBody"]>["content"]["application/json"];
export type RevokeClientSessionResponse = void;
export type DeleteExternalUserResponse = operations["deleteExternalUser"]["responses"][202]["content"]["application/json"];
export type GetExternalUserDeletionResponse = operations["getExternalUserDeletion"]["responses"][200]["content"]["application/json"];
export type ListProvidersResponse = operations["listProviders"]["responses"][200]["content"]["application/json"];
export type ListProvidersQuery = NonNullable<operations["listProviders"]["parameters"]["query"]>;
export type ListDeployRegionsResponse = operations["listDeployRegions"]["responses"][200]["content"]["application/json"];
export type ListDeployRegionsQuery = NonNullable<operations["listDeployRegions"]["parameters"]["query"]>;
export type ListDeployModelsResponse = operations["listDeployModels"]["responses"][200]["content"]["application/json"];
export type ListDeployModelsQuery = NonNullable<operations["listDeployModels"]["parameters"]["query"]>;
export type ListInstanceTemplatesResponse = operations["listInstanceTemplates"]["responses"][200]["content"]["application/json"];
export type ListInstanceTemplatesQuery = NonNullable<operations["listInstanceTemplates"]["parameters"]["query"]>;
export type GetInstanceTemplateResponse = operations["getInstanceTemplate"]["responses"][200]["content"]["application/json"];
export type ListAgentTemplatesResponse = operations["listAgentTemplates"]["responses"][200]["content"]["application/json"];
export type ListAgentTemplatesQuery = NonNullable<operations["listAgentTemplates"]["parameters"]["query"]>;
export type ListInstancesResponse = operations["listInstances"]["responses"][200]["content"]["application/json"];
export type ListInstancesQuery = NonNullable<operations["listInstances"]["parameters"]["query"]>;
export type InstanceCreateResponse = operations["instanceCreate"]["responses"][202]["content"]["application/json"];
export type GetInstanceResponse = operations["getInstance"]["responses"][200]["content"]["application/json"];
export type UpdateInstanceMetadataResponse = operations["updateInstanceMetadata"]["responses"][200]["content"]["application/json"];
export type DeleteInstanceResponse = operations["deleteInstance"]["responses"][202]["content"]["application/json"];
export type GetInstanceStatusResponse = operations["getInstanceStatus"]["responses"][200]["content"]["application/json"];
export type StartInstanceResponse = operations["startInstance"]["responses"][202]["content"]["application/json"];
export type StopInstanceResponse = operations["stopInstance"]["responses"][202]["content"]["application/json"];
export type UpgradeInstanceResponse = operations["upgradeInstance"]["responses"][202]["content"]["application/json"];
export type UpgradeInstanceRequest = NonNullable<operations["upgradeInstance"]["requestBody"]>["content"]["application/json"];
export type GetInstanceUpgradeResponse = operations["getInstanceUpgrade"]["responses"][200]["content"]["application/json"];
export type ListAgentsResponse = operations["listAgents"]["responses"][200]["content"]["application/json"];
export type ListAgentsQuery = NonNullable<operations["listAgents"]["parameters"]["query"]>;
export type GetAgentResponse = operations["getAgent"]["responses"][200]["content"]["application/json"];
export type UpdateAgentResponse = operations["updateAgent"]["responses"][200]["content"]["application/json"];
export type CreateAgentConversationResponse = operations["createAgentConversation"]["responses"][201]["content"]["application/json"];
export type ListAgentConversationsResponse = operations["listAgentConversations"]["responses"][200]["content"]["application/json"];
export type ListAgentConversationsQuery = NonNullable<operations["listAgentConversations"]["parameters"]["query"]>;
export type GetConversationResponse = operations["getConversation"]["responses"][200]["content"]["application/json"];
export type UpdateConversationResponse = operations["updateConversation"]["responses"][200]["content"]["application/json"];
export type DeleteConversationResponse = void;
export type ListConversationMessagesResponse = operations["listConversationMessages"]["responses"][200]["content"]["application/json"];
export type ListConversationMessagesQuery = NonNullable<operations["listConversationMessages"]["parameters"]["query"]>;
export type GetConversationMessageResponse = operations["getConversationMessage"]["responses"][200]["content"]["application/json"];
export type CancelConversationResponse = operations["cancelConversation"]["responses"][202]["content"]["application/json"];
export type ClearConversationResponse = operations["clearConversation"]["responses"][202]["content"]["application/json"];
export type SetConversationModelResponse = operations["setConversationModel"]["responses"][202]["content"]["application/json"];
export type GetUsageSummaryResponse = operations["getUsageSummary"]["responses"][200]["content"]["application/json"];
export type GetUsageSummaryQuery = NonNullable<operations["getUsageSummary"]["parameters"]["query"]>;
export type CreateTerminalSessionResponse = operations["createTerminalSession"]["responses"][201]["content"]["application/json"];
export type CreateTerminalSessionRequest = NonNullable<operations["createTerminalSession"]["requestBody"]>["content"]["application/json"];
export type CreateCanvasSessionResponse = operations["createCanvasSession"]["responses"][201]["content"]["application/json"];
export type CreateCanvasSessionRequest = NonNullable<operations["createCanvasSession"]["requestBody"]>["content"]["application/json"];
export type ExecInstanceResponse = operations["execInstance"]["responses"][200]["content"]["application/json"];
export type ExecInstanceRequest = NonNullable<operations["execInstance"]["requestBody"]>["content"]["application/json"];
export type PresignFileUploadResponse = operations["presignFileUpload"]["responses"][201]["content"]["application/json"];
export type ConfirmFileUploadResponse = operations["confirmFileUpload"]["responses"][200]["content"]["application/json"];
export type ListFilesResponse = operations["listFiles"]["responses"][200]["content"]["application/json"];
export type ListFilesQuery = NonNullable<operations["listFiles"]["parameters"]["query"]>;
export type GetFileResponse = operations["getFile"]["responses"][200]["content"]["application/json"];
export type RenameFileResponse = operations["renameFile"]["responses"][200]["content"]["application/json"];
export type RenameFileRequest = NonNullable<operations["renameFile"]["requestBody"]>["content"]["application/json"];
export type DeleteFileResponse = void;
export type GetAgentTemplateResponse = operations["getAgentTemplate"]["responses"][200]["content"]["application/json"];
export type CreateShareFileShareResponse = operations["createShareFileShare"]["responses"][200]["content"]["application/json"];
export type GetShareFileShareResponse = operations["getShareFileShare"]["responses"][200]["content"]["application/json"];
export type RevokeShareFileShareResponse = void;
export type ResolveFileShareResponse = operations["resolveFileShare"]["responses"][200]["content"]["application/json"];
export type GetFilesSummaryResponse = operations["getFilesSummary"]["responses"][200]["content"]["application/json"];
export type CreateShareReplyResponse = operations["createShareReply"]["responses"][200]["content"]["application/json"];
export type GetShareReplyResponse = operations["getShareReply"]["responses"][200]["content"]["application/json"];
export type RevokeShareReplyResponse = void;
export type ResolveReplyShareResponse = operations["resolveReplyShare"]["responses"][200]["content"]["application/json"];
export type GetInstanceConnectURLResponse = operations["getInstanceConnectURL"]["responses"][200]["content"]["application/json"];
export type GetInstanceConnectURLQuery = NonNullable<operations["getInstanceConnectURL"]["parameters"]["query"]>;
export type GetInstanceStreamURLResponse = operations["getInstanceStreamURL"]["responses"][200]["content"]["application/json"];
export type GetInstanceStreamURLQuery = NonNullable<operations["getInstanceStreamURL"]["parameters"]["query"]>;
export type ResumeConversationResponse = operations["resumeConversation"]["responses"][200]["content"]["application/json"];
export type CreateAutomationResponse = operations["createAutomation"]["responses"][201]["content"]["application/json"];
export type ListAutomationsResponse = operations["listAutomations"]["responses"][200]["content"]["application/json"];
export type ListAutomationsQuery = NonNullable<operations["listAutomations"]["parameters"]["query"]>;
export type GetAutomationResponse = operations["getAutomation"]["responses"][200]["content"]["application/json"];
export type UpdateAutomationResponse = operations["updateAutomation"]["responses"][200]["content"]["application/json"];
export type DeleteAutomationResponse = void;
export type PauseAutomationResponse = operations["pauseAutomation"]["responses"][200]["content"]["application/json"];
export type ResumeAutomationResponse = operations["resumeAutomation"]["responses"][200]["content"]["application/json"];
export type CreateAutomationRunResponse = operations["createAutomationRun"]["responses"][202]["content"]["application/json"];
export type ListAutomationRunsResponse = operations["listAutomationRuns"]["responses"][200]["content"]["application/json"];
export type ListAutomationRunsQuery = NonNullable<operations["listAutomationRuns"]["parameters"]["query"]>;
export type GetAutomationRunResponse = operations["getAutomationRun"]["responses"][200]["content"]["application/json"];
export type CreateWebhookAutomationResponse = operations["createWebhookAutomation"]["responses"][201]["content"]["application/json"];
export type TranscribeAudioResponse = operations["transcribeAudio"]["responses"][200]["content"]["application/json"];
export type TranscribeAudioRequest = NonNullable<operations["transcribeAudio"]["requestBody"]>["content"]["multipart/form-data"];
export type GetShareCanvasResponse = operations["getShareCanvas"]["responses"][200]["content"]["application/json"];
export type CreateShareCanvasResponse = operations["createShareCanvas"]["responses"][200]["content"]["application/json"];
export type CreateShareCanvasRequest = NonNullable<operations["createShareCanvas"]["requestBody"]>["content"]["application/json"];
export type DeleteShareCanvasResponse = void;
export type ListCanvasSnapshotsResponse = operations["listCanvasSnapshots"]["responses"][200]["content"]["application/json"];
export type RestoreCanvasSnapshotResponse = operations["restoreCanvasSnapshot"]["responses"][200]["content"]["application/json"];
export type GetCanvasSessionResponse = operations["getCanvasSession"]["responses"][200]["content"]["application/json"];
export type GetAgentBindDetailsResponse = operations["getAgentBindDetails"]["responses"][200]["content"]["application/json"];
export type ConfirmAgentBindResponse = operations["confirmAgentBind"]["responses"][200]["content"]["application/json"];
export type ConfirmAgentBindRequest = NonNullable<operations["confirmAgentBind"]["requestBody"]>["content"]["application/json"];
export type CreatePortalBindResponse = operations["createPortalBind"]["responses"][200]["content"]["application/json"];
export type CreatePortalBindRequest = NonNullable<operations["createPortalBind"]["requestBody"]>["content"]["application/json"];
export type GetPortalBindResponse = operations["getPortalBind"]["responses"][200]["content"]["application/json"];
export type RevokePortalBindResponse = operations["revokePortalBind"]["responses"][200]["content"]["application/json"];
export type ResolvePortalBindResponse = operations["resolvePortalBind"]["responses"][200]["content"]["application/json"];
export type ResolvePortalBindRequest = NonNullable<operations["resolvePortalBind"]["requestBody"]>["content"]["application/json"];
export type InvokeA2AResponse = operations["invokeA2A"]["responses"][200]["content"]["application/json"];
export type InvokeA2ARequest = NonNullable<operations["invokeA2A"]["requestBody"]>["content"]["application/json"];
export type GetA2AAgentCardResponse = operations["getA2AAgentCard"]["responses"][200]["content"]["application/json"];
export type GetA2AAgentCardLegacyResponse = operations["getA2AAgentCardLegacy"]["responses"][200]["content"]["application/json"];
export type ListA2ATasksResponse = operations["listA2ATasks"]["responses"][200]["content"]["application/json"];
export type ListA2ATasksQuery = NonNullable<operations["listA2ATasks"]["parameters"]["query"]>;
export type GetA2ATaskResponse = operations["getA2ATask"]["responses"][200]["content"]["application/json"];
export type GetA2ATaskQuery = NonNullable<operations["getA2ATask"]["parameters"]["query"]>;
export type CancelA2ATaskResponse = operations["cancelA2ATask"]["responses"][200]["content"]["application/json"];
export type GetDiscoveryResponse = operations["getDiscovery"]["responses"][200]["content"]["application/json"];
export type ListHarnessesResponse = operations["listHarnesses"]["responses"][200]["content"]["application/json"];
export type CreateHarnessResponse = operations["createHarness"]["responses"][200]["content"]["application/json"];
export type GetHarnessResponse = operations["getHarness"]["responses"][200]["content"]["application/json"];
export type UpdateHarnessResponse = operations["updateHarness"]["responses"][200]["content"]["application/json"];
export type DeleteHarnessResponse = operations["deleteHarness"]["responses"][200]["content"]["application/json"];
export type ListModelsResponse = operations["listModels"]["responses"][200]["content"]["application/json"];
export type ListHarnessModelsResponse = operations["listHarnessModels"]["responses"][200]["content"]["application/json"];
export type CreateResponseResponse = operations["createResponse"]["responses"][200]["content"]["application/json"];
export type GetResponseResponse = operations["getResponse"]["responses"][200]["content"]["application/json"];
export type DeleteResponseResponse = operations["deleteResponse"]["responses"][200]["content"]["application/json"];
export type GetResponseInputItemsResponse = operations["getResponseInputItems"]["responses"][200]["content"]["application/json"];
export type CancelResponseResponse = operations["cancelResponse"]["responses"][200]["content"]["application/json"];
export type GetResponseEventsResponse = AsyncIterable<components["schemas"]["UHPEvent"]>;
export type APIErrorBody = components["schemas"]["ErrorResponse"] | components["schemas"]["DeviceBindingErrorResponse"] | components["schemas"]["UHPErrorEnvelope"];
