// retries a failed promise before giving up
import delay from 'delay';

const retryPromise = fn => {

    const attempt = async (...callArgs) => {
        try {
            return await fn(...callArgs);
        } catch (e) {
            console.log('reattempting ', callArgs);
            await delay(100);
            return await fn(...callArgs);
        }
    };
    return attempt;
};

export default retryPromise;
