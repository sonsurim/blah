import BadRequestError from './bad_request_error';

export default function checkSupportMethod(supportMethod: string[], method?: string) {
  if (supportMethod.indexOf(method!) === -1) {
    throw new BadRequestError('지원하지 않는 Method!');
  }
}
