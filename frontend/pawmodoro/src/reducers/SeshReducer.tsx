const SeshReducer = (sesh, action) => {
    switch (action.type) {
        case 'create':
            return {
                id: sesh.id,
                duration: sesh.duration,
                music: sesh.music,
                done: false
            }
    }
    throw Error('Unknown action: ' + action.type);
}

export default SeshReducer;