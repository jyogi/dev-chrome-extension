import { createStore } from 'redux';
import reducers from '../reducers';
import wilddog from 'wilddog';
import { syncURL, authDomain } from '../config';
import _ from 'underscore';

wilddog.initializeApp({
  syncURL,
  authDomain
});

/**
 * 登录
 * @param email
 * @param password
 */
const login = (email, password) => (
  wilddog
    .auth()
    .signInWithEmailAndPassword(email, password)
);

/**
 * 加载 path
 * @param path
 */
const fetchJSON = path => (
  new Promise((resolve) => {
    const ref = wilddog.sync().ref(path);
    ref.once('value', snapshot => {
      resolve(snapshot.val());
    })
  })
);

const configStore = ({
  email,
  password
}) => (
  login(email, password)
    .then(user => (
      Promise.all(
        [fetchJSON('/versions'), fetchJSON(`/users/${user.uid}`), new Promise(resolve => resolve(user))]
      )
    ))
    .then(([versions, settings, user]) => {
      return createStore(
        reducers,
        {
          versions: _.values(versions),
          settings,
          user
        },
        window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
      )
    })
);

export default configStore;
