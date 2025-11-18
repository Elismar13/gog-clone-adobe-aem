import Keycloak from 'keycloak-js';

const kcUrl = (process as any)?.env?.REACT_APP_KC_URL || (window as any).__KC_URL__;
const kcRealm = (process as any)?.env?.REACT_APP_KC_REALM || (window as any).__KC_REALM__;
const kcClient = (process as any)?.env?.REACT_APP_KC_CLIENT_ID || (window as any).__KC_CLIENT_ID__;

const keycloak = new (Keycloak as any)({ url: kcUrl, realm: kcRealm, clientId: kcClient });

export default keycloak;
