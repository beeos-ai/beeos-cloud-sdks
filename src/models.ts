export type JSONValue = null | boolean | number | string | JSONValue[] | {
    [key: string]: JSONValue;
};
export interface paths {
    "/client-sessions": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** @description Issue a client token with request-scoped ttl_seconds. The omitted value normalizes to 600 before idempotency comparison; reusing an Idempotency-Key with a different normalized TTL returns 409 idempotency_conflict. */
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
        /** @description Rotate the client token with request-scoped ttl_seconds. The omitted value normalizes to 600 before idempotency comparison; reusing an Idempotency-Key with a different normalized TTL returns 409 idempotency_conflict. */
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
        get: operations["listInstances"];
        put?: never;
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
        get: operations["getInstance"];
        put?: never;
        post?: never;
        delete: operations["deleteInstance"];
        options?: never;
        head?: never;
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
        get: operations["getAgent"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
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
        get: operations["listAgentConversations"];
        put?: never;
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
        get: operations["getConversation"];
        put?: never;
        post?: never;
        delete: operations["deleteConversation"];
        options?: never;
        head?: never;
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
        put: operations["setConversationModel"];
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/tasks": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAgentTasks"];
        put?: never;
        post: operations["createAgentTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/tasks/{taskId}": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["getAgentTask"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/tasks/{taskId}/messages": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["listAgentTaskMessages"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/tasks/{taskId}/cancel": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["cancelAgentTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/tasks/{taskId}/continue": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["continueAgentTask"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/agents/{agentId}/invoke": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        post: operations["invokeAgent"];
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
        get: operations["getFile"];
        put?: never;
        post?: never;
        delete: operations["deleteFile"];
        options?: never;
        head?: never;
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
        get: operations["getShareFileShare"];
        put?: never;
        post: operations["createShareFileShare"];
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
        get: operations["getShareReply"];
        put?: never;
        post: operations["createShareReply"];
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
        get: operations["listAutomations"];
        put?: never;
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
        get: operations["getAutomation"];
        put?: never;
        post?: never;
        delete: operations["deleteAutomation"];
        options?: never;
        head?: never;
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
        get: operations["listAutomationRuns"];
        put?: never;
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
        get: operations["getShareCanvas"];
        put?: never;
        post: operations["createShareCanvas"];
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
         * Create a harness
         * @description Synchronous: Cloud submits every runtime operation and waits (up to 45s, so use a client timeout of at least 60s) before responding. 502 harness_error lists per-item results in error.detail.operations[]; 504 beeos_harness_update_in_progress means work continues, retry the identical request after Retry-After; 409 beeos_harness_busy means a different write is in flight, retry after Retry-After; 503 harness_unavailable means the instance is not running or the operation journal is unavailable. instance_id and name are required; default_model is honored only here. skills are rejected on create (422 beeos_field_not_supported); add them with PUT. Not supported by BeeOS Cloud yet (422): a non-empty mcp_servers (beeos_mcp_not_supported); system_prompt, disabled_tools, environment, max_step, timeout_seconds, plugins (beeos_field_not_supported).
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
         * Replace a harness
         * @description Synchronous: Cloud submits every runtime operation and waits (up to 45s, so use a client timeout of at least 60s) before responding. 502 harness_error lists per-item results in error.detail.operations[]; 504 beeos_harness_update_in_progress means work continues, retry the identical request after Retry-After; 409 beeos_harness_busy means a different write is in flight, retry after Retry-After; 503 harness_unavailable means the instance is not running or the operation journal is unavailable. An absent field is unchanged. When skills is present it is diffed against the installed skills: listed skills with files, content or blob are installed; omitted catalog-origin skills are uninstalled; a listed skill that is not installed and has no files, content or blob returns 422; enabled:false on a fresh install returns 422. base is immutable; a name change or a default_model different from the current one (without template_id) returns 422 beeos_field_not_supported. Not supported by BeeOS Cloud yet (422): a non-empty mcp_servers (beeos_mcp_not_supported); system_prompt, disabled_tools, environment, max_step, timeout_seconds, plugins (beeos_field_not_supported).
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
            /** @enum {unknown} */
            client_type: "web" | "native";
            requested_capabilities: string[];
            /** Format: uri */
            origin?: string;
            device_attestation?: {
                jkt: string;
            };
            /**
             * @description Requested token lifetime in seconds for this issuance. Explicit values outside 60..1800 return 400 invalid_request.
             * @default 600
             */
            ttl_seconds?: number;
        };
        Binding: {
            /** @enum {unknown} */
            client_type: "web" | "native";
            /** Format: uri */
            origin?: string;
            cnf_jkt?: string;
        };
        ClientSessionResponse: {
            access_token: string;
            /** @enum {unknown} */
            client_api_url: "https://client-api.cloud.beeos.ai/v1";
            /**
             * Format: date-time
             * @description Actual expiration of the issued token, capped by the remaining session authorization lifetime.
             */
            expires_at: string;
            session_id: string;
            app_id: string;
            external_user_id: components["schemas"]["ExternalUserID"];
            capabilities: string[];
            binding: components["schemas"]["Binding"];
        };
        DeletionAccepted: {
            deletion_id: string;
            /** @enum {unknown} */
            status: "pending" | "processing" | "failed" | "completed";
        };
        Deletion: {
            id: string;
            status: string;
            deleted_resources: {
                [key: string]: number;
            };
        };
        Provider: {
            id: string;
            name: string;
            description?: string;
            capabilities?: components["schemas"]["ProviderCapabilities"];
        };
        DeployRegion: {
            id: string;
            name: string;
            available: boolean;
        };
        DeployModel: {
            id: string;
            name: string;
            tier?: string;
            reasoning?: boolean;
            input?: string[];
            context_window?: number;
        };
        InstanceTemplate: {
            id: string;
            name: string;
            description?: string;
            logo_url?: string;
            sort_order?: number;
            agent_framework?: string;
            provider_id?: string;
            specs?: components["schemas"]["CatalogSpec"][];
            variants?: components["schemas"]["CatalogVariant"][];
        };
        ProviderPage: {
            data: components["schemas"]["Provider"][];
            total: number;
        };
        RegionPage: {
            data: components["schemas"]["DeployRegion"][];
            total: number;
        };
        ModelPage: {
            data: components["schemas"]["DeployModel"][];
            total: number;
        };
        InstanceSummary: {
            id: string;
            organization_id: string;
            app_id: string;
            developer_id: string;
            name: string;
            agent_framework: string;
            provider_id: string;
            region: string;
            os_type: string;
            status: string;
            desired_status: string;
            connectivity: string;
            ms_connection_status: string;
            created_at: string;
            updated_at: string;
            /** Format: int64 */
            resource_version: number;
        };
        InstancePage: {
            data: components["schemas"]["InstanceSummary"][];
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
            id: string;
            spec_value_ids: string[];
            sort_order: number;
        };
        InstanceTemplatePage: {
            data: components["schemas"]["InstanceTemplate"][];
            total: number;
        };
        AgentSnapshot: {
            id: string;
            instance_id: string;
            name: string;
            display_name?: string;
            description: string;
            status: string;
            visibility: string;
            conversation_transport: string;
            /** Format: int64 */
            resource_version: number;
            mcp_enabled: boolean;
            a2a_enabled: boolean;
            capabilities: {
                [key: string]: boolean;
            };
            skills: components["schemas"]["AgentSkill"][];
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
        };
        AgentSkill: {
            id: string;
            name: string;
            description: string;
            tags: string[];
            enabled: boolean;
        };
        AgentPatch: {
            /** @enum {string} */
            visibility?: "private" | "unlisted" | "org" | "public" | "marketplace";
            mcp_enabled?: boolean;
            a2a_enabled?: boolean;
        };
        AgentResponse: {
            data: components["schemas"]["AgentSnapshot"];
        };
        AgentPage: {
            data: components["schemas"]["AgentAgent"][];
            total: number;
        };
        CreateConversationInput: {
            title?: string;
        };
        Conversation: {
            id: string;
            agent_id: string;
            instance_id: string;
            title: string;
            /** @enum {string} */
            state: "open" | "closed";
            /** Format: int64 */
            metadata_version: number;
            /** Format: int64 */
            history_generation: number;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            last_activity_at?: string;
            /** Format: date-time */
            closed_at?: string;
            /** Format: int64 */
            resource_version: number;
            model_override_id?: string;
            effective_model_id?: string;
        };
        ConversationResponse: {
            data: components["schemas"]["Conversation"];
        };
        ConversationPage: {
            conversations: components["schemas"]["Conversation"][];
            next_cursor?: string;
            has_more: boolean;
        };
        Message: {
            id: string;
            conversation_id: string;
            type: string;
            content: JSONValue;
            sender: string;
            reply_to?: string;
            /** Format: date-time */
            created_at: string;
            /** Format: int64 */
            offset: number;
            /** Format: int64 */
            history_generation: number;
            state?: string;
            stop_reason?: string;
            body?: string;
            parts?: {
                [key: string]: JSONValue;
            }[];
            /** Format: date-time */
            updated_at?: string;
            runtime_dispatch?: {
                [key: string]: JSONValue;
            };
            /** @enum {string} */
            realtime_publish_status?: "published" | "unconfirmed" | "not_republished";
        };
        MessagePage: {
            messages: components["schemas"]["Message"][];
            next_cursor?: string;
            has_more: boolean;
            /** Format: int64 */
            latest_offset: number;
            /** Format: int64 */
            history_generation: number;
            /** Format: int64 */
            history_boundary_offset: number;
        };
        MessageEnvelope: {
            id: string;
            conversation_id: string;
            type: string;
            sender: string;
            reply_to?: string;
            body: string;
            parts?: {
                [key: string]: JSONValue;
            }[];
            state: string;
            stop_reason?: string;
            content?: JSONValue;
            /** Format: date-time */
            created_at?: string;
            /** Format: date-time */
            updated_at?: string;
        };
        MessageEnvelopeResponse: {
            data: components["schemas"]["MessageEnvelope"];
        };
        UpdateConversationInput: {
            title: string;
        };
        CancelConversationInput: {
            target_message_id: string;
            reason?: string;
        };
        SetConversationModelInput: {
            model_override_id: string | null;
        };
        CommandReceipt: {
            request_id: string;
            status: string;
        };
        CommandReceiptResponse: {
            data: components["schemas"]["CommandReceipt"];
        };
        ClearConversationReceipt: {
            request_id: string;
            conversation_id: string;
            /** Format: int64 */
            current_generation: number;
            status: string;
        };
        ClearConversationReceiptResponse: {
            data: components["schemas"]["ClearConversationReceipt"];
        };
        CreateTaskInput: {
            message: string;
            context_id?: string;
            deadline_ms?: number;
            metadata?: {
                [key: string]: string;
            };
            attachments?: JSONValue[];
        };
        CreateTaskResult: {
            task_id: string;
            agent_id: string;
            status: string;
            created_at: string;
        };
        CreateTaskResponse: {
            data: components["schemas"]["CreateTaskResult"];
        };
        Task: {
            task_id: string;
            organization_id?: string;
            app_id?: string;
            instance_id?: string;
            agent_id: string;
            conversation_id?: string;
            status: string;
            result?: JSONValue;
            error?: string;
            metadata?: {
                [key: string]: string;
            };
            /** Format: int64 */
            resource_version?: number;
            created_at: string;
            started_at?: string;
            completed_at?: string;
            deadline_at?: string;
            truncated?: boolean;
            /** Format: int64 */
            history_generation: number;
            /** Format: int64 */
            latest_offset: number;
        };
        TaskResponse: {
            data: components["schemas"]["Task"];
        };
        TaskPage: {
            tasks: components["schemas"]["Task"][];
            next_since?: string;
            has_more: boolean;
        };
        CancelTaskInput: {
            reason?: string;
        };
        ContinueTaskInput: {
            input?: JSONValue;
            auth_grant?: boolean;
        };
        ErrorResponse: {
            code: string;
            message: string;
            request_id: string;
        };
        UHPDiscovery: {
            /** @enum {string} */
            object: "uhp.discovery";
            /** @enum {string} */
            protocol: "uhp";
            versions: string[];
            default_version: string;
            /** @enum {string} */
            conformance_class: "core" | "extended" | "full";
            capabilities: components["schemas"]["UHPCapabilities"];
            /**
             * @description The Agent Plugins manifest schema identifiers this server installs. Present and non-empty
             *     when `capabilities.plugins` is true.
             * @example [
             *       "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json"
             *     ]
             */
            plugin_schemas?: string[];
            implementation?: {
                name?: string;
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
            streaming?: boolean;
            sessions?: boolean;
            cancellation?: boolean;
            files_input?: boolean;
            files_output?: boolean;
            session_listing?: boolean;
            harness_management?: boolean;
            session_sharing?: boolean;
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
            id: string;
            /** @enum {string} */
            object?: "harness";
            name: string;
            /**
             * @description Opaque. Not enumerated by this specification — a client must treat it as a string, or the
             *     protocol would need revising every time a harness is released.
             * @example codex
             * @example claude-code
             * @example hermes
             */
            base: string;
            baseLabel?: string;
            defaultModel?: string;
            systemPrompt?: string;
            mcpServers?: components["schemas"]["UHPMcpServer"][];
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
            disabledTools?: string[];
            maxStep?: number | null;
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
            /** Format: uri */
            url: string;
            /**
             * @default http
             * @enum {string}
             */
            transport?: "http" | "sse";
            /** @default true */
            enabled?: boolean;
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
            /** @default true */
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
            /** Format: uri */
            $schema: string;
            name: string;
            version?: string;
            description?: string;
            author?: {
                name?: string;
                email?: string;
                url?: string;
            } & {
                [key: string]: JSONValue;
            };
            homepage?: string;
            repository?: string;
            license?: string;
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
        UHPModelCatalog: {
            backends: {
                [key: string]: {
                    default: string;
                    models: components["schemas"]["UHPModel"][];
                };
            };
        };
        UHPHarnessModels: {
            harness_id?: string;
            backend?: string;
            default?: string;
            fallback?: string;
            models: components["schemas"]["UHPModel"][];
        };
        UHPModel: {
            id: string;
            label?: string;
            backend?: string;
            /**
             * @description Computed, not asserted: true means the server can serve this model for this harness right
             *     now. Listing a model as available and then failing the task is the worst outcome for a
             *     client, because a user has already chosen it.
             */
            available: boolean;
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
                harness_id?: string;
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @default false */
            stream?: boolean;
            previous_response_id?: string | null;
            instructions?: string;
            /** @default true */
            store?: boolean;
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
            /** @default false */
            background?: boolean;
        } & {
            [key: string]: JSONValue;
        };
        UHPResponse: {
            id: string;
            /** @enum {string} */
            object: "response";
            /** @description Unix seconds */
            created_at: number;
            status: components["schemas"]["UHPResponseStatus"];
            /** @description Non-null only when status is `failed`. */
            error?: null | components["schemas"]["UHPError"];
            incomplete_details?: {
                [key: string]: JSONValue;
            } | null;
            previous_response_id?: string | null;
            /** @description The model that actually ran. */
            model: string;
            output: components["schemas"]["UHPOutputItem"][];
            store?: boolean;
            /**
             * @description null when the server cannot account for usage. A fabricated zero would be worse than an
             *     honest absence, because a client cannot tell it from a free task.
             */
            usage?: null | components["schemas"]["UHPUsage"];
            metadata?: {
                session_id?: string;
                /** @description The environment the task read, when it read one (capability `environments`). */
                environment?: string;
                /** @description The id the client sent, when the client sent one. */
                requested_model?: string;
                /** @description True only when the harness reported it could not switch to the requested model. */
                model_fallback?: boolean;
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
            id?: string;
            /**
             * @example message
             * @example reasoning
             * @example function_call
             * @example function_call_output
             */
            type: string;
            status?: string;
            role?: string;
            content?: components["schemas"]["UHPContentPart"][];
            summary?: {
                [key: string]: JSONValue;
            }[];
            call_id?: string;
            name?: string;
            /** @description JSON, as a string */
            arguments?: string;
            output?: string;
        } & {
            [key: string]: JSONValue;
        };
        UHPContentPart: {
            /** @example output_text */
            type: string;
            text?: string;
            annotations?: components["schemas"]["UHPAnnotation"][];
        } & {
            [key: string]: JSONValue;
        };
        UHPAnnotation: {
            /** @enum {string} */
            type: "container_file_citation";
            container_id?: string;
            file_id?: string;
            filename?: string;
            /** Format: uri */
            download_url?: string;
            start_index?: number;
            end_index?: number;
        } & {
            [key: string]: JSONValue;
        };
        UHPUsage: {
            input_tokens?: number;
            output_tokens?: number;
            total_tokens?: number;
            cache_read_tokens?: number;
            cache_write_tokens?: number;
        } & {
            [key: string]: JSONValue;
        };
        UHPErrorEnvelope: {
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
            /** @enum {string} */
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
            sequence_number: number;
            response?: components["schemas"]["UHPResponse"];
            item?: components["schemas"]["UHPOutputItem"];
            part?: components["schemas"]["UHPContentPart"];
            annotation?: components["schemas"]["UHPAnnotation"];
            delta?: string;
            text?: string;
            arguments?: string;
            item_id?: string;
            output_index?: number;
            content_index?: number;
            summary_index?: number;
            annotation_index?: number;
            code?: string;
            message?: string;
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
            id: string;
            organization_id: string;
            app_id: string;
            developer_id: string;
            name: string;
            agent_framework: string;
            provider_id: string;
            region: string;
            os_type: string;
            status: string;
            desired_status: string;
            connectivity: string;
            error_code?: string;
            ms_connection_status: string;
            image_id?: string;
            image_version_id?: string;
            image_version?: string;
            image_ref?: string;
            model_primary?: string;
            models?: string[];
            llm?: components["schemas"]["RuntimeLLMView"] | null;
            hosting_type?: string;
            cloud_provider?: string;
            resource_version: number;
            created_at: string;
            updated_at: string;
            capabilities: {
                computer?: boolean;
                mobile?: boolean;
                device?: boolean;
                terminal?: boolean;
            };
        };
        RuntimeUpgradeJob: {
            job_id: string;
            instance_id: string;
            status: string;
            target: string;
            created_at: string;
            completed_at?: string | null;
            error?: string | null;
        };
        RuntimeLLM: {
            providers: components["schemas"]["RuntimeLLMProvider"][];
            models: components["schemas"]["RuntimeLLMModel"][];
        };
        RuntimeLLMView: {
            providers: components["schemas"]["RuntimeLLMProviderView"][];
            models: components["schemas"]["RuntimeLLMModel"][];
        };
        RuntimeLLMProvider: {
            id: string;
            /** @enum {string} */
            protocol: "openai" | "anthropic";
            base_url: string;
            api_key?: string;
        };
        RuntimeLLMProviderView: {
            id: string;
            protocol: string;
            base_url: string;
        };
        RuntimeLLMModel: {
            provider_id: string;
            model: string;
            role: string;
            order: number;
        };
        RuntimeOperationSummary: {
            id: string;
            kind: string;
            phase: string;
            error_code?: string;
        };
        RuntimeInstanceResult: {
            data: components["schemas"]["RuntimeInstanceSummary"];
            operation: components["schemas"]["RuntimeOperationSummary"];
        };
        RuntimeExecResult: {
            exit_code: number;
            stdout: string;
            stderr: string;
            truncated: boolean;
        };
        FileFile: {
            file_id: string;
            filename: string;
            content_type: string;
            size_bytes: number;
            checksum_sha256?: string;
            status: string;
            resource_version: number;
            /** Format: date-time */
            updated_at: string;
            title?: string;
            file_type: string;
            /** Format: date-time */
            created_at: string;
            confirmed_at?: string | null;
            origin?: components["schemas"]["FileOrigin"] | null;
        };
        FileOrigin: {
            source: string;
            instance_id?: string;
            agent_id?: string;
            operation_id?: string;
            instance_name?: string;
            agent_name?: string;
            avatar_url?: string;
            agent_framework?: string;
            destroyed?: boolean;
        };
        FileTransferDescriptor: {
            direction: string;
            file_id: string;
            url: string;
            http_method: string;
            required_headers: {
                [key: string]: string;
            };
            /** Format: date-time */
            expires_at: string;
            content_type: string;
            size_bytes: number;
            checksum_sha256?: string;
        };
        FileChatUploadContext: {
            instance_id: string;
            agent_id?: string;
        };
        FilePrepareUploadInput: {
            upload_context?: components["schemas"]["FileChatUploadContext"] | null;
            filename: string;
            content_type: string;
            size_bytes: number;
            checksum_sha256?: string;
        };
        FileConfirmInput: {
            checksum_sha256?: string;
        };
        FilePage: {
            data: components["schemas"]["FileFile"][];
            total: number;
            next_since?: string;
        };
        FileResolution: {
            file: components["schemas"]["FileFile"];
            download: components["schemas"]["FileTransferDescriptor"];
        };
        FileSummary: {
            file_count: number;
            storage_file_count: number;
            used_bytes: number;
            image_count: number;
            video_count: number;
            document_count: number;
            instances: {
                source: string;
                instance_id?: string;
                agent_id?: string;
                operation_id?: string;
                instance_name?: string;
                agent_name?: string;
                avatar_url?: string;
                agent_framework?: string;
                destroyed?: boolean;
                count: number;
            }[];
        };
        AgentAgent: {
            id: string;
            instance_id: string;
            name: string;
            avatar_url?: string;
            display_name?: string;
            description: string;
            resource_version: number;
            status: string;
            visibility: string;
            mcp_enabled: boolean;
            a2a_enabled: boolean;
            capabilities: {
                [key: string]: boolean;
            };
            skills: components["schemas"]["AgentSkill"][];
            conversation_transport: string;
            /** Format: date-time */
            created_at: string;
            /** Format: date-time */
            updated_at: string;
        };
        AgentAttachment: {
            file_id: string;
        };
        AgentInvokeInput: {
            message: string;
            context_id?: string;
            timeout_ms?: number;
            metadata?: {
                [key: string]: string;
            };
            attachments?: components["schemas"]["AgentAttachment"][];
        };
        AgentInvokeResult: {
            operation_id?: string;
            text: string;
            context_id: string;
            is_error: boolean;
        };
        A2AMessage: {
            messageId: string;
            role: string;
            parts: components["schemas"]["A2AOutputPart"][];
            contextId?: string;
            taskId?: string;
            referenceTaskIds?: string[];
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2ATaskStatus: {
            state: string;
            message?: components["schemas"]["A2AMessage"] | null;
            timestamp?: string;
        };
        A2AArtifact: {
            artifactId: string;
            name?: string;
            description?: string;
            parts: components["schemas"]["A2AOutputPart"][];
            metadata?: {
                [key: string]: JSONValue;
            };
            extensions?: string[];
        };
        A2ATextPartOut: {
            text: string;
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2AFilePartOut: {
            url?: string;
            filename?: string;
            mediaType?: string;
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        A2ADataPartOut: {
            data: JSONValue;
            metadata?: {
                [key: string]: JSONValue;
            };
        };
        agentBindWire: {
            status: string;
            bind_id?: string;
            instance_id?: string;
            public_key?: string;
            hostname?: string;
            expires_at?: number;
            runtime_binding?: components["schemas"]["bindRuntimeWire"] | null;
        };
        bindRuntimeWire: {
            instance_id: string;
            agent_gateway_url: string;
            message_service_url: string;
        };
        agentBindDetailsWire: {
            bind_id: string;
            hostname: string;
            fingerprint_short: string;
            agent_framework: string;
            os_type?: string;
            expires_at: number;
            status: string;
            server_time: number;
        };
        portalBindWire: {
            provider_id?: string;
            bind_id: string;
            short_code: string;
            status: string;
            instance_id?: string;
            expires_at: number;
            name: string;
            qr_payload?: string;
            api_base_url?: string;
            relay_url?: string;
            desired_status?: string;
            connectivity?: string;
            resource_version?: number;
        };
        agentTemplateCatalogView: {
            id: string;
            display_name: string;
            summary: string;
            description: string;
            category: string;
            vibe: string;
            icon_url: string;
            banner_url: string;
            default_model: string;
            tags: string[];
            agent_framework: string;
            template_version: string;
        };
        a2aTaskView: {
            id: string;
            contextId: string;
            status: components["schemas"]["A2ATaskStatus"];
            artifacts?: components["schemas"]["A2AArtifact"][];
            history?: components["schemas"]["A2AMessage"][];
            metadata?: {
                [key: string]: JSONValue;
            };
            caller_principal_id: string;
            caller_agent_id: string;
            caller_owner_id: string;
            target_principal_id: string;
            target_agent_id: string;
            target_owner_id: string;
            channel_id?: string;
            created_at?: string;
            updated_at?: string;
            completed_at?: string;
        };
        CreateServerInstanceInput: {
            name: string;
            variant_id?: string;
            /** @enum {string} */
            agent_framework?: "openclaw";
            llm?: components["schemas"]["RuntimeLLM"] | null;
        };
        ServerUsageSummary: {
            total_bc: string;
            total_records: number;
            by_category: {
                [key: string]: string;
            };
            by_app?: {
                [key: string]: string;
            };
            category_counts: {
                [key: string]: number;
            };
        };
        RuntimeInstanceStatusResult: {
            data: {
                id: string;
                name: string;
                status: string;
                desired_status: string;
                connectivity: string;
            };
            operation: components["schemas"]["RuntimeOperationSummary"];
        };
        UpdateServerInstanceInput: {
            name?: string;
            llm?: components["schemas"]["RuntimeLLM"];
        };
        FileShareResponse: {
            file_id: string;
            slug: string;
            filename: string;
            content_type: string;
            size_bytes: number;
            revoked: boolean;
        };
        ReplyShareResponse: {
            data: {
                slug: string;
                created_at: string;
                agent: {
                    name: string;
                    avatar_url: string;
                    framework: string;
                };
                reply: {
                    parts: {
                        type: string;
                        text: string;
                    }[];
                    created_at: string;
                };
                sources: {
                    url?: string;
                    title?: string;
                }[];
                files: {
                    file_id?: string;
                    filename?: string;
                    content_type?: string;
                    size_bytes?: number;
                }[];
            };
        };
        ConnectURLResponse: {
            data: {
                url: string;
                mode: string;
                token: string;
                service: string;
                connectivity: string;
                stream_session_id: string;
                browser?: {
                    grant_id: string;
                    generation: string;
                    expires_at: string;
                    role: string;
                };
            };
        };
        ProtoAutomationRule: {
            id?: string;
            name?: string;
            prompt?: string;
            target?: components["schemas"]["ProtoAutomationTarget"];
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            session?: components["schemas"]["ProtoAutomationSession"];
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validUntil?: string;
            status?: string;
            /** Format: date-time */
            nextFireAt?: string;
            createdInConversationId?: string;
            /** Format: date-time */
            createdAt?: string;
            /** Format: date-time */
            updatedAt?: string;
            triggerKind?: string;
            hookId?: string;
            source?: string;
            eventFilter?: string;
            mailbox?: string;
        };
        ProtoAutomationTarget: {
            instanceId?: string;
            agentId?: string;
        };
        ProtoAutomationSchedule: {
            kind?: string;
            tz?: string;
            /** Format: date-time */
            at?: string;
            intervalSeconds?: string;
            /** Format: date-time */
            anchorAt?: string;
            expression?: string;
        };
        ProtoAutomationSession: {
            mode?: string;
            boundConversationId?: string;
        };
        ProtoAutomationInput: {
            name?: string;
            prompt?: string;
            target?: components["schemas"]["ProtoAutomationTarget"];
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            session?: components["schemas"]["ProtoAutomationSession"];
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validUntil?: string;
            createdInConversationId?: string;
        };
        ProtoListAutomationsResponse: {
            items?: components["schemas"]["ProtoAutomationRule"][];
            nextCursor?: string;
        };
        ProtoAutomationPatch: {
            name?: string;
            prompt?: string;
            target?: components["schemas"]["ProtoAutomationTarget"];
            schedule?: components["schemas"]["ProtoAutomationSchedule"];
            session?: components["schemas"]["ProtoAutomationSession"];
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validUntil?: string;
            clearValidFrom?: boolean;
            clearValidUntil?: boolean;
        };
        ProtoAutomationRun: {
            id?: string;
            automationId?: string;
            triggerType?: string;
            /** Format: date-time */
            scheduledAt?: string;
            /** Format: date-time */
            createdAt?: string;
            status?: string;
            target?: components["schemas"]["ProtoAutomationTarget"];
            session?: components["schemas"]["ProtoAutomationSession"];
            conversationId?: string;
            wakeMessageId?: string;
            sourceRunId?: string;
            rerunSessionMode?: string;
            reasonCode?: string;
            /** Format: date-time */
            dispatchedAt?: string;
        };
        ProtoAutomationRunInput: {
            sourceRunId?: string;
            rerunSessionMode?: string;
        };
        ProtoListAutomationRunsResponse: {
            items?: components["schemas"]["ProtoAutomationRun"][];
            nextCursor?: string;
        };
        ProtoAutomationWebhookInput: {
            name?: string;
            prompt?: string;
            target?: components["schemas"]["ProtoAutomationTarget"];
            session?: components["schemas"]["ProtoAutomationSession"];
            /** Format: date-time */
            validFrom?: string;
            /** Format: date-time */
            validUntil?: string;
            createdInConversationId?: string;
            source?: string;
            events?: string[];
            repoOwner?: string;
            repoName?: string;
            eventFilter?: string;
            mailbox?: string;
        };
        RuntimeMethodResponse: {
            /** @enum {string} */
            jsonrpc: "2.0";
            id: string | number | null;
            result?: JSONValue;
            error?: {
                code: number;
                message: string;
                data?: JSONValue;
            };
        };
        CanvasShare: {
            id: string;
            canvasId: string;
            slug: string;
            mode: string;
            allowInteraction: boolean;
            expiresAt?: string;
            createdAt: string;
        };
        CanvasSnapshot: {
            id: string;
            canvasId: string;
            componentsSnapshot?: string;
            actorType: string;
            actorId: string;
            description?: string;
            version: number;
            createdAt: string;
        };
        A2AAgentCard: {
            name: string;
            description: string;
            url?: string;
            version: string;
            protocolVersion?: string;
            defaultInputModes: string[];
            defaultOutputModes: string[];
            supportedInterfaces?: {
                url: string;
                protocolBinding: string;
                protocolVersion: string;
            }[];
        };
        A2AOutputPart: components["schemas"]["A2ATextPartOut"] | components["schemas"]["A2AFilePartOut"] | components["schemas"]["A2ADataPartOut"];
        RealtimeTicketHeader: {
            alg: string;
            typ: string;
            kid: string;
        };
        TerminalTicketClaims: {
            iss: string;
            aud: string;
            sub: string;
            jti: string;
            instance_id: string;
            platform_agent_id: string;
            client_id: string;
            conversation_id?: string;
            resume_terminal_id?: string;
            iat: number;
            exp: number;
        };
        CanvasTicketClaims: {
            iss: string;
            sub: string;
            jti: string;
            purpose: string;
            instance_id: string;
            platform_agent_id: string;
            client_id: string;
            conversation_id: string;
            canvas_id: string;
            role: string;
            session_id: string;
            aud: string[];
            iat: number;
            exp: number;
        };
        TerminalSessionDocument: {
            transport: string;
            protocolVersion: number;
            header: components["schemas"]["RealtimeTicketHeader"];
            websocketUrl: string;
            ticket: string;
            /** Format: date-time */
            issuedAt: string;
            /** Format: date-time */
            expiresAt: string;
            claims: components["schemas"]["TerminalTicketClaims"];
        };
        CanvasSessionDocument: {
            transport: string;
            protocolVersion: number;
            header: components["schemas"]["RealtimeTicketHeader"];
            relayUrl: string;
            ticket: string;
            /** Format: date-time */
            issuedAt: string;
            /** Format: date-time */
            expiresAt: string;
            claims: components["schemas"]["CanvasTicketClaims"];
        };
        DeviceBindingErrorResponse: {
            error: string;
            message: string;
        };
        UHPHarnessCreate: {
            name?: string;
            base: string;
            /** @description BeeOS Cloud honors this only on create; a different value on PUT returns 422 beeos_field_not_supported unless template_id is sent. */
            default_model?: string;
            system_prompt?: string;
            /** @description Not accepted by BeeOS Cloud yet: a non-empty list returns 422 beeos_mcp_not_supported. */
            mcp_servers?: components["schemas"]["UHPMcpServer"][];
            skills?: components["schemas"]["UHPSkill"][];
            /** @description Requires the `plugins` capability. Each item needs `files` or `blob`. */
            plugins?: components["schemas"]["UHPPlugin"][];
            /** @description An environment id of the caller's scope, or empty. Requires the `environments` capability. */
            environment?: string;
            disabled_tools?: string[];
            max_step?: number | null;
            timeout_seconds?: number | null;
            /** @description BeeOS extension. Instance that hosts a new harness (create only). */
            instance_id?: string;
            /** @description BeeOS extension. Agent template applied to the harness. */
            template_id?: string;
        } & {
            [key: string]: JSONValue;
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
                harness_id?: string;
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @constant */
            stream?: false;
            previous_response_id?: string | null;
            instructions?: string;
            /** @default true */
            store?: boolean;
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
            /** @default false */
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
                harness_id?: string;
                environment?: string;
            } & {
                [key: string]: JSONValue;
            };
            /** @constant */
            stream?: true;
            previous_response_id?: string | null;
            instructions?: string;
            /** @default true */
            store?: boolean;
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
            /** @default false */
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
    createClientSession: {
        parameters: {
            query?: never;
            header: {
                "X-BeeOS-External-User-ID": components["schemas"]["ExternalUserID"];
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
                "X-BeeOS-External-User-ID": components["schemas"]["ExternalUserID"];
                "Idempotency-Key": string;
            };
            path: {
                sessionId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
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
                "X-BeeOS-External-User-ID": components["schemas"]["ExternalUserID"];
                "Idempotency-Key": string;
            };
            path: {
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
                "Idempotency-Key": string;
            };
            path: {
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
                externalUserId: components["schemas"]["ExternalUserID"];
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
                provider_id?: string;
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
                agent_framework?: string;
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
                page?: number;
                page_size?: number;
                agent_framework?: string;
                provider_id?: string;
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
                category?: string;
                search?: string;
                page?: number;
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
                page?: number;
                page_size?: number;
                status?: string;
                provider_id?: string;
                agent_framework?: string;
                cluster_id?: string;
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
                "Idempotency-Key": string;
                "If-Match": string;
            };
            path: {
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
                "If-Match": string;
            };
            path: {
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
                "Idempotency-Key": string;
                "If-Match": string;
            };
            path: {
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
                "Idempotency-Key": string;
                "If-Match": string;
            };
            path: {
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
                "Idempotency-Key": string;
            };
            path: {
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    image_id?: string;
                    image_ref?: string;
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
                instanceId: string;
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
                instance_id?: string;
                status?: string;
                visibility?: string;
                search?: string;
                page?: number;
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
                "If-Match": string;
            };
            path: {
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
                cursor?: string;
                limit?: number;
                state?: "open" | "closed" | "all";
            };
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
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
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
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
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
                "If-Match": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
                cursor?: string;
                limit?: number;
            };
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
                conversationId: string;
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
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
                "If-Match": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
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
    listAgentTasks: {
        parameters: {
            query?: {
                cursor?: string;
                since?: string;
                limit?: number;
                state?: "all" | "queued" | "running" | "input_required" | "auth_required" | "completed" | "failed" | "canceled" | "timeout" | "rejected";
            };
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authorized Agent tasks */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["TaskPage"];
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
    createAgentTask: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["CreateTaskInput"];
            };
        };
        responses: {
            /** @description Task accepted */
            202: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["CreateTaskResponse"];
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
    getAgentTask: {
        parameters: {
            query?: never;
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Authorized Task */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["TaskResponse"];
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
    listAgentTaskMessages: {
        parameters: {
            query?: {
                cursor?: string;
                since?: string;
                limit?: number;
            };
            header: {
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description Task message history */
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
    cancelAgentTask: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["CancelTaskInput"];
            };
        };
        responses: {
            /** @description Task cancel accepted */
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
    continueAgentTask: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
                "X-BeeOS-External-User-ID": string;
            };
            path: {
                agentId: string;
                taskId: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": components["schemas"]["ContinueTaskInput"];
            };
        };
        responses: {
            /** @description Task continue accepted */
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
    invokeAgent: {
        parameters: {
            query?: never;
            header: {
                "Idempotency-Key": string;
            };
            path: {
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["AgentInvokeInput"];
            };
        };
        responses: {
            /** @description Success */
            200: {
                headers: {
                    [name: string]: JSONValue | undefined;
                };
                content: {
                    "application/json": components["schemas"]["AgentInvokeResult"];
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
                period?: "day" | "week" | "month";
                external_user_id?: string;
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
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    platformAgentId: string;
                    /** Format: uuid */
                    conversationId?: string;
                    /** Format: uuid */
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
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** Format: uuid */
                    platformAgentId: string;
                    /** Format: uuid */
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
                instanceId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    argv: string[];
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
                "Idempotency-Key": string;
            };
            path: {
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
                content_type?: string;
                since?: string;
                status?: string;
                file_type?: string;
                category?: string;
                source?: string;
                q?: string;
                instance_id?: string;
                agent_id?: string;
                sort?: string;
                sort_dir?: string;
                limit?: number;
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
                "Idempotency-Key": string;
            };
            path: {
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
                fileId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
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
                "Idempotency-Key": string;
            };
            path: {
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
                agentId: string;
                conversationId: string;
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
                        data: {
                            slug: string;
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
                agentId: string;
                conversationId: string;
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
                        data: {
                            slug: string;
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
                agentId: string;
                conversationId: string;
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
                service?: string;
                client_id?: string;
                role?: string;
                generation?: string;
            };
            header?: never;
            path: {
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
                viewportWidth?: number;
                viewportHeight?: number;
                dpr?: number;
            };
            header?: never;
            path: {
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
                "Idempotency-Key": string;
            };
            path: {
                agentId: string;
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
                status?: string;
                cursor?: string;
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
                status?: string;
                cursor?: string;
                limit?: number;
            };
            header?: never;
            path: {
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
                "Idempotency-Key": string;
            };
            path: {
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
                automationId: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
                canvasId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    mode: string;
                    password?: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
                canvasId: string;
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
                "X-BeeOS-Conversation-ID": string;
                "X-BeeOS-Platform-Agent-ID": string;
            };
            path: {
                instanceId: string;
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
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    name?: string;
                    modelPrimary?: string;
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
                id: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    decision: "recover" | "create";
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
                agentId: string;
            };
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": {
                    /** @enum {string} */
                    jsonrpc: "2.0";
                    id?: string;
                    method: string;
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
                direction?: string;
                agent_id?: string;
                cursor?: string;
                limit?: number;
            };
            header?: never;
            path: {
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
                history_length?: number;
            };
            header?: never;
            path: {
                agentId: string;
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
                agentId: string;
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
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody: {
            content: {
                "application/json": components["schemas"]["UHPHarnessCreate"];
            };
        };
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
            header?: never;
            path: {
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
            409: {
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
                        id: string;
                        deleted: boolean;
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
                        id?: string;
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
                        /** @enum {string} */
                        object?: "list";
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
                "Last-Event-ID"?: string;
                "UHP-Version"?: string;
            };
            path: {
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
export type CommandReceipt = components["schemas"]["CommandReceipt"];
export type CommandReceiptResponse = components["schemas"]["CommandReceiptResponse"];
export type ClearConversationReceipt = components["schemas"]["ClearConversationReceipt"];
export type ClearConversationReceiptResponse = components["schemas"]["ClearConversationReceiptResponse"];
export type CreateTaskInput = components["schemas"]["CreateTaskInput"];
export type CreateTaskResult = components["schemas"]["CreateTaskResult"];
export type CreateTaskResponse = components["schemas"]["CreateTaskResponse"];
export type Task = components["schemas"]["Task"];
export type TaskResponse = components["schemas"]["TaskResponse"];
export type TaskPage = components["schemas"]["TaskPage"];
export type CancelTaskInput = components["schemas"]["CancelTaskInput"];
export type ContinueTaskInput = components["schemas"]["ContinueTaskInput"];
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
export type RuntimeUpgradeJob = components["schemas"]["RuntimeUpgradeJob"];
export type RuntimeLLM = components["schemas"]["RuntimeLLM"];
export type RuntimeLLMView = components["schemas"]["RuntimeLLMView"];
export type RuntimeLLMProvider = components["schemas"]["RuntimeLLMProvider"];
export type RuntimeLLMProviderView = components["schemas"]["RuntimeLLMProviderView"];
export type RuntimeLLMModel = components["schemas"]["RuntimeLLMModel"];
export type RuntimeOperationSummary = components["schemas"]["RuntimeOperationSummary"];
export type RuntimeInstanceResult = components["schemas"]["RuntimeInstanceResult"];
export type RuntimeExecResult = components["schemas"]["RuntimeExecResult"];
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
export type AgentAttachment = components["schemas"]["AgentAttachment"];
export type AgentInvokeInput = components["schemas"]["AgentInvokeInput"];
export type AgentInvokeResult = components["schemas"]["AgentInvokeResult"];
export type A2AMessage = components["schemas"]["A2AMessage"];
export type A2ATaskStatus = components["schemas"]["A2ATaskStatus"];
export type A2AArtifact = components["schemas"]["A2AArtifact"];
export type A2ATextPartOut = components["schemas"]["A2ATextPartOut"];
export type A2AFilePartOut = components["schemas"]["A2AFilePartOut"];
export type A2ADataPartOut = components["schemas"]["A2ADataPartOut"];
export type agentBindWire = components["schemas"]["agentBindWire"];
export type bindRuntimeWire = components["schemas"]["bindRuntimeWire"];
export type agentBindDetailsWire = components["schemas"]["agentBindDetailsWire"];
export type portalBindWire = components["schemas"]["portalBindWire"];
export type agentTemplateCatalogView = components["schemas"]["agentTemplateCatalogView"];
export type a2aTaskView = components["schemas"]["a2aTaskView"];
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
export type UHPHarnessCreate = components["schemas"]["UHPHarnessCreate"];
export type UHPCreateResponseJSONRequest = components["schemas"]["UHPCreateResponseJSONRequest"];
export type UHPCreateResponseStreamRequest = components["schemas"]["UHPCreateResponseStreamRequest"];
export type CreateClientSessionResponse = operations["createClientSession"]["responses"][200]["content"]["application/json"];
export type CreateClientSessionInput = NonNullable<operations["createClientSession"]["requestBody"]>["content"]["application/json"];
export type RefreshClientSessionResponse = operations["refreshClientSession"]["responses"][200]["content"]["application/json"];
export type RefreshClientSessionInput = NonNullable<operations["refreshClientSession"]["requestBody"]>["content"]["application/json"];
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
export type InstanceCreateInput = NonNullable<operations["instanceCreate"]["requestBody"]>["content"]["application/json"];
export type GetInstanceResponse = operations["getInstance"]["responses"][200]["content"]["application/json"];
export type UpdateInstanceMetadataResponse = operations["updateInstanceMetadata"]["responses"][200]["content"]["application/json"];
export type UpdateInstanceMetadataInput = NonNullable<operations["updateInstanceMetadata"]["requestBody"]>["content"]["application/json"];
export type DeleteInstanceResponse = operations["deleteInstance"]["responses"][202]["content"]["application/json"];
export type GetInstanceStatusResponse = operations["getInstanceStatus"]["responses"][200]["content"]["application/json"];
export type StartInstanceResponse = operations["startInstance"]["responses"][202]["content"]["application/json"];
export type StopInstanceResponse = operations["stopInstance"]["responses"][202]["content"]["application/json"];
export type UpgradeInstanceResponse = operations["upgradeInstance"]["responses"][202]["content"]["application/json"];
export type UpgradeInstanceInput = NonNullable<operations["upgradeInstance"]["requestBody"]>["content"]["application/json"];
export type GetInstanceUpgradeResponse = operations["getInstanceUpgrade"]["responses"][200]["content"]["application/json"];
export type ListAgentsResponse = operations["listAgents"]["responses"][200]["content"]["application/json"];
export type ListAgentsQuery = NonNullable<operations["listAgents"]["parameters"]["query"]>;
export type GetAgentResponse = operations["getAgent"]["responses"][200]["content"]["application/json"];
export type UpdateAgentResponse = operations["updateAgent"]["responses"][200]["content"]["application/json"];
export type UpdateAgentInput = NonNullable<operations["updateAgent"]["requestBody"]>["content"]["application/json"];
export type CreateAgentConversationResponse = operations["createAgentConversation"]["responses"][201]["content"]["application/json"];
export type CreateAgentConversationInput = NonNullable<operations["createAgentConversation"]["requestBody"]>["content"]["application/json"];
export type ListAgentConversationsResponse = operations["listAgentConversations"]["responses"][200]["content"]["application/json"];
export type ListAgentConversationsQuery = NonNullable<operations["listAgentConversations"]["parameters"]["query"]>;
export type GetConversationResponse = operations["getConversation"]["responses"][200]["content"]["application/json"];
export type UpdateConversationResponse = operations["updateConversation"]["responses"][200]["content"]["application/json"];
export type UpdateConversationInput = NonNullable<operations["updateConversation"]["requestBody"]>["content"]["application/json"];
export type DeleteConversationResponse = void;
export type ListConversationMessagesResponse = operations["listConversationMessages"]["responses"][200]["content"]["application/json"];
export type ListConversationMessagesQuery = NonNullable<operations["listConversationMessages"]["parameters"]["query"]>;
export type GetConversationMessageResponse = operations["getConversationMessage"]["responses"][200]["content"]["application/json"];
export type CancelConversationResponse = operations["cancelConversation"]["responses"][202]["content"]["application/json"];
export type CancelConversationInput = NonNullable<operations["cancelConversation"]["requestBody"]>["content"]["application/json"];
export type ClearConversationResponse = operations["clearConversation"]["responses"][202]["content"]["application/json"];
export type SetConversationModelResponse = operations["setConversationModel"]["responses"][202]["content"]["application/json"];
export type SetConversationModelInput = NonNullable<operations["setConversationModel"]["requestBody"]>["content"]["application/json"];
export type CreateAgentTaskResponse = operations["createAgentTask"]["responses"][202]["content"]["application/json"];
export type CreateAgentTaskInput = NonNullable<operations["createAgentTask"]["requestBody"]>["content"]["application/json"];
export type ListAgentTasksResponse = operations["listAgentTasks"]["responses"][200]["content"]["application/json"];
export type ListAgentTasksQuery = NonNullable<operations["listAgentTasks"]["parameters"]["query"]>;
export type GetAgentTaskResponse = operations["getAgentTask"]["responses"][200]["content"]["application/json"];
export type ListAgentTaskMessagesResponse = operations["listAgentTaskMessages"]["responses"][200]["content"]["application/json"];
export type ListAgentTaskMessagesQuery = NonNullable<operations["listAgentTaskMessages"]["parameters"]["query"]>;
export type CancelAgentTaskResponse = operations["cancelAgentTask"]["responses"][202]["content"]["application/json"];
export type CancelAgentTaskInput = NonNullable<operations["cancelAgentTask"]["requestBody"]>["content"]["application/json"];
export type ContinueAgentTaskResponse = operations["continueAgentTask"]["responses"][202]["content"]["application/json"];
export type ContinueAgentTaskInput = NonNullable<operations["continueAgentTask"]["requestBody"]>["content"]["application/json"];
export type InvokeAgentResponse = operations["invokeAgent"]["responses"][200]["content"]["application/json"];
export type InvokeAgentInput = NonNullable<operations["invokeAgent"]["requestBody"]>["content"]["application/json"];
export type GetUsageSummaryResponse = operations["getUsageSummary"]["responses"][200]["content"]["application/json"];
export type GetUsageSummaryQuery = NonNullable<operations["getUsageSummary"]["parameters"]["query"]>;
export type CreateTerminalSessionResponse = operations["createTerminalSession"]["responses"][201]["content"]["application/json"];
export type CreateTerminalSessionInput = NonNullable<operations["createTerminalSession"]["requestBody"]>["content"]["application/json"];
export type CreateCanvasSessionResponse = operations["createCanvasSession"]["responses"][201]["content"]["application/json"];
export type CreateCanvasSessionInput = NonNullable<operations["createCanvasSession"]["requestBody"]>["content"]["application/json"];
export type ExecInstanceResponse = operations["execInstance"]["responses"][200]["content"]["application/json"];
export type ExecInstanceInput = NonNullable<operations["execInstance"]["requestBody"]>["content"]["application/json"];
export type PresignFileUploadResponse = operations["presignFileUpload"]["responses"][201]["content"]["application/json"];
export type PresignFileUploadInput = NonNullable<operations["presignFileUpload"]["requestBody"]>["content"]["application/json"];
export type ConfirmFileUploadResponse = operations["confirmFileUpload"]["responses"][200]["content"]["application/json"];
export type ConfirmFileUploadInput = NonNullable<operations["confirmFileUpload"]["requestBody"]>["content"]["application/json"];
export type ListFilesResponse = operations["listFiles"]["responses"][200]["content"]["application/json"];
export type ListFilesQuery = NonNullable<operations["listFiles"]["parameters"]["query"]>;
export type GetFileResponse = operations["getFile"]["responses"][200]["content"]["application/json"];
export type RenameFileResponse = operations["renameFile"]["responses"][200]["content"]["application/json"];
export type RenameFileInput = NonNullable<operations["renameFile"]["requestBody"]>["content"]["application/json"];
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
export type CreateAutomationInput = NonNullable<operations["createAutomation"]["requestBody"]>["content"]["application/json"];
export type ListAutomationsResponse = operations["listAutomations"]["responses"][200]["content"]["application/json"];
export type ListAutomationsQuery = NonNullable<operations["listAutomations"]["parameters"]["query"]>;
export type GetAutomationResponse = operations["getAutomation"]["responses"][200]["content"]["application/json"];
export type UpdateAutomationResponse = operations["updateAutomation"]["responses"][200]["content"]["application/json"];
export type UpdateAutomationInput = NonNullable<operations["updateAutomation"]["requestBody"]>["content"]["application/json"];
export type DeleteAutomationResponse = void;
export type PauseAutomationResponse = operations["pauseAutomation"]["responses"][200]["content"]["application/json"];
export type ResumeAutomationResponse = operations["resumeAutomation"]["responses"][200]["content"]["application/json"];
export type CreateAutomationRunResponse = operations["createAutomationRun"]["responses"][202]["content"]["application/json"];
export type CreateAutomationRunInput = NonNullable<operations["createAutomationRun"]["requestBody"]>["content"]["application/json"];
export type ListAutomationRunsResponse = operations["listAutomationRuns"]["responses"][200]["content"]["application/json"];
export type ListAutomationRunsQuery = NonNullable<operations["listAutomationRuns"]["parameters"]["query"]>;
export type GetAutomationRunResponse = operations["getAutomationRun"]["responses"][200]["content"]["application/json"];
export type CreateWebhookAutomationResponse = operations["createWebhookAutomation"]["responses"][201]["content"]["application/json"];
export type CreateWebhookAutomationInput = NonNullable<operations["createWebhookAutomation"]["requestBody"]>["content"]["application/json"];
export type TranscribeAudioResponse = operations["transcribeAudio"]["responses"][200]["content"]["application/json"];
export type TranscribeAudioInput = NonNullable<operations["transcribeAudio"]["requestBody"]>["content"]["multipart/form-data"];
export type GetShareCanvasResponse = operations["getShareCanvas"]["responses"][200]["content"]["application/json"];
export type CreateShareCanvasResponse = operations["createShareCanvas"]["responses"][200]["content"]["application/json"];
export type CreateShareCanvasInput = NonNullable<operations["createShareCanvas"]["requestBody"]>["content"]["application/json"];
export type DeleteShareCanvasResponse = void;
export type ListCanvasSnapshotsResponse = operations["listCanvasSnapshots"]["responses"][200]["content"]["application/json"];
export type RestoreCanvasSnapshotResponse = operations["restoreCanvasSnapshot"]["responses"][200]["content"]["application/json"];
export type GetCanvasSessionResponse = operations["getCanvasSession"]["responses"][200]["content"]["application/json"];
export type GetAgentBindDetailsResponse = operations["getAgentBindDetails"]["responses"][200]["content"]["application/json"];
export type ConfirmAgentBindResponse = operations["confirmAgentBind"]["responses"][200]["content"]["application/json"];
export type ConfirmAgentBindInput = NonNullable<operations["confirmAgentBind"]["requestBody"]>["content"]["application/json"];
export type CreatePortalBindResponse = operations["createPortalBind"]["responses"][200]["content"]["application/json"];
export type CreatePortalBindInput = NonNullable<operations["createPortalBind"]["requestBody"]>["content"]["application/json"];
export type GetPortalBindResponse = operations["getPortalBind"]["responses"][200]["content"]["application/json"];
export type RevokePortalBindResponse = operations["revokePortalBind"]["responses"][200]["content"]["application/json"];
export type ResolvePortalBindResponse = operations["resolvePortalBind"]["responses"][200]["content"]["application/json"];
export type ResolvePortalBindInput = NonNullable<operations["resolvePortalBind"]["requestBody"]>["content"]["application/json"];
export type InvokeA2AResponse = operations["invokeA2A"]["responses"][200]["content"]["application/json"];
export type InvokeA2AInput = NonNullable<operations["invokeA2A"]["requestBody"]>["content"]["application/json"];
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
export type CreateHarnessInput = NonNullable<operations["createHarness"]["requestBody"]>["content"]["application/json"];
export type GetHarnessResponse = operations["getHarness"]["responses"][200]["content"]["application/json"];
export type UpdateHarnessResponse = operations["updateHarness"]["responses"][200]["content"]["application/json"];
export type UpdateHarnessInput = NonNullable<operations["updateHarness"]["requestBody"]>["content"]["application/json"];
export type DeleteHarnessResponse = operations["deleteHarness"]["responses"][200]["content"]["application/json"];
export type ListModelsResponse = operations["listModels"]["responses"][200]["content"]["application/json"];
export type ListHarnessModelsResponse = operations["listHarnessModels"]["responses"][200]["content"]["application/json"];
export type CreateResponseResponse = operations["createResponse"]["responses"][200]["content"]["application/json"];
export type CreateResponseInput = NonNullable<operations["createResponse"]["requestBody"]>["content"]["application/json"];
export type GetResponseResponse = operations["getResponse"]["responses"][200]["content"]["application/json"];
export type DeleteResponseResponse = operations["deleteResponse"]["responses"][200]["content"]["application/json"];
export type GetResponseInputItemsResponse = operations["getResponseInputItems"]["responses"][200]["content"]["application/json"];
export type CancelResponseResponse = operations["cancelResponse"]["responses"][200]["content"]["application/json"];
export type GetResponseEventsResponse = AsyncIterable<components["schemas"]["UHPEvent"]>;
export type APIErrorBody = components["schemas"]["ErrorResponse"] | components["schemas"]["DeviceBindingErrorResponse"] | components["schemas"]["UHPErrorEnvelope"];
