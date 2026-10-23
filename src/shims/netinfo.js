const netInfoState = {
    isConnected: true,
    isInternetReachable: true,
    type: 'wifi',
    details: {
        isConnectionExpensive: false,
    },
};

const listeners = new Set();

const NetInfo = {
    fetch: async () => netInfoState,
    addEventListener: (listener) => {
        listeners.add(listener);
        setTimeout(() => {
            try {
                listener(netInfoState);
            } catch (e) {
                // ignore
            }
        }, 0);
        return () => {
            listeners.delete(listener);
        };
    },
    useNetInfo: () => netInfoState,
};

export default NetInfo;
export { NetInfo };
