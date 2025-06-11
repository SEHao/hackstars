import { registerAs } from '@nestjs/config';

export default registerAs('cat', () => ({
  httpCatApi: 'https://http.cat',
}));
