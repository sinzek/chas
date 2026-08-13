import { is } from './src/guard/index.js';
import { ok, ResultAsync, settleAsync } from './src/chas.js';
console.log(Object.keys(is));

const results = await settleAsync({
	idea: Promise.resolve(ok(1)),
	scripts: ResultAsync.from('hey'),
});
console.log(results);
