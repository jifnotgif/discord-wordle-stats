import { 
    CLIENT_ID_PARAM_KEY,
    DISCORD_AUTH_BASE_URL,
    OAUTH2_RESPONSE_TYPE,
    OAUTH2_SCOPE,
    RESPONSE_TYPE_PARAM_KEY,
    SCOPE_PARAM_KEY,
    STATE_PARAM_KEY
} from '@/constants';

export const createHashMap = (hash: string): Record<string, string> | null => {
    if (!hash) {
        return null;
    }
    // remove leading # character
    const hashParameters: string = hash.substring(1);
    return hashParameters.split("&")
            .map(value => value.split("="))
            .reduce( 
                (previousMap, [key, value]) => (
                    { ...previousMap,
                        [key]: value
                    }
                ), {});
}

export const validateUrlHash = (hashMap: Record<string, string>): boolean => {
    return !!(
        hashMap.access_token?.length > 0 &&
        hashMap.state === sessionStorage.getItem(STATE_PARAM_KEY) &&
        hashMap.scope === OAUTH2_SCOPE
    );
};

export const constructAuthUrl = (stateHash?: string): URL => {
    if (!process.env.REACT_APP_DISCORD_CLIENT_ID) {
        throw new Error('Failed to fetch client ID');
    }
    const url = new URL(DISCORD_AUTH_BASE_URL);
    url.searchParams.append(RESPONSE_TYPE_PARAM_KEY, OAUTH2_RESPONSE_TYPE);
    url.searchParams.append(CLIENT_ID_PARAM_KEY, process.env.REACT_APP_DISCORD_CLIENT_ID);
    url.searchParams.append(SCOPE_PARAM_KEY, OAUTH2_SCOPE);
    if (stateHash) {
        url.searchParams.append(STATE_PARAM_KEY, stateHash);
    }
    return url;
};
