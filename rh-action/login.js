import { credentials } from '../config';
import robinhoodLib from 'robinhood';
import retryPromise from '../utils/retry-promise';

const login = () => {
    return new Promise((resolve) => {
        console.log('initializing Robinhood');
        const Robinhood = robinhoodLib(credentials, () => {

            // promisfy all functions
            Object.keys(Robinhood).forEach(key => {
                const origFn = Robinhood[key];
                Robinhood[key] = retryPromise((...callArgs) => {
                    return new Promise((resolve, reject) => {
                        origFn.apply(null, [...callArgs, (error, response, body) => {
                            return (error || !body) ? reject(error) : resolve(body);
                        }]);
                    });
                });
            });

            console.log('Robinhood initialized');
            resolve(Robinhood);
        });
    });
};

export default login;