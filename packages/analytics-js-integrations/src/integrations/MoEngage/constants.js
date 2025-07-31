import {
  MOENGAGE_NAME as NAME,
  MOENGAGE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'MoEngage';

const CNameMapping = {
  [NAME]: NAME,
  MoEngage: NAME,
  moengage: NAME,
  Moengage: NAME,
  'Mo Engage': NAME,
  'mo engage': NAME,
  'Mo engage': NAME,
};

const IdentifyUserPropertiesMap = {
  email: 'u_em',
  firstName: 'u_fn',
  lastName: 'u_ln',
  firstname: 'u_fn',
  lastname: 'u_ln',
  phone: 'u_mb',
  username: 'u_n',
  userName: 'u_n',
  gender: 'u_gd',
  birthday: 'u_bd',
  name: 'u_n',
  id: null,
};

// custom traits mapping context.traits --> moengage properties
const TraitsMap = {
  firstName: 'first_name',
  lastName: 'last_name',
  firstname: 'first_name',
  lastname: 'last_name',
  email: 'email',
  phone: 'mobile',
  name: 'user_name',
  username: 'user_name',
  userName: 'user_name',
  gender: 'gender',
  birthday: 'birthday',
  id: null,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME, IdentifyUserPropertiesMap, TraitsMap };
