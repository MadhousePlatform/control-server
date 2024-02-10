const temp_client_tokens = [
    { token: 'test1', name: 'test1', id: '1', topics: ['message', 'player_join', 'player_part'] },
    { token: 'test2', name: 'test2', id: '2', topics: ['connected', 'disconnected', 'message', 'player_join', 'player_part'] },
]

class Auth {
    auth(client_token) {
        const client = temp_client_tokens.find(token => token.token === client_token);
        if (client) {
            return { success: true, name: client.name, id: client.id, topics: client.topics };
        }

        return { success: false };
    }
}

export default Auth;
