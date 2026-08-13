import { type Guard } from '../base/shared.js';
import { makeGuard } from '../base/proxy.js';

export interface NullishGuard<T> extends Guard<T | null | undefined, {}, NullishGuard<T>> {}
export interface NullishGuardFactory {
	<T>(guard: Guard<T>): NullishGuard<T>;
}

export const NullishGuardFactory: NullishGuardFactory = <T>(guard: Guard<T>) => {
	return makeGuard((v: unknown): v is T | null | undefined => v === null || v === undefined || guard(v), {
		id: 'nullish',
		name: `nullish<${guard.meta.name}>`,
		inner: guard,
		isNullable: true,
		isOptional: true,
		jsonSchema: {
			...guard.meta.jsonSchema,
			_nullable: true,
			_optional: true,
		},
		transform: (v: unknown, original: unknown) =>
			original == null ? original : guard.meta.transform ? guard.meta.transform(v, original) : v,
	});
};
