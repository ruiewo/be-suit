import aspida from '@aspida/fetch';

import api from '../pages/$api';

export const client = api(aspida());
