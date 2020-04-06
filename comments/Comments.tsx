import * as React from 'react';
import axios, { AxiosInstance } from 'axios';

// const instance = axios.create({
//   baseURL: 'https://some-domain.com/api/',
//   timeout: 1000,
//   headers: {'X-Custom-Header': 'foobar'}
// });

const baseUrlMap = { OAuth: 'https://github.com', api: 'https://api.github.com' };

interface AjaxProps {
  type?: 'OAuth' | 'api';
  timeout?: number;
}

function ajax(props: AjaxProps = {}) {
  return axios.create({
    baseURL: baseUrlMap[props.type] || baseUrlMap.api,
    timeout: props.timeout || 3000,
    // headers: {'X-Custom-Header': 'foobar'}
  });
}

const authAjax = ajax({ type: 'OAuth' });
const apiAjax = ajax();

async function authorize(authParams) {
  const result = await authAjax({ url: '/login/oauth/authorize', method: 'get', ...authParams});
  console.log(result, ">>>>>>>>>>")
}

let client_id = '5962d91e68425e69e653';
let client_secret = '3231ff558fe41ba150fb868effdc099b7ac8d864';

export default class Comments extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  
  componentDidMount() {
    authorize({ params: { client_id }  })
  }

  render() {
    return <div />
  }
}