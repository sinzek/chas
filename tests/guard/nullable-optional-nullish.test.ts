import { describe, it, expect, vi } from 'vitest';
import { is } from '../../src/guard/index.js';

describe('nullable, optional, nullish', () => {
	it('nullable', () => {
		const guard = is.nullable(is.number);
		expect(guard(123)).toBe(true);
		expect(guard(null)).toBe(true);
		expect(guard(undefined)).toBe(false);
		expect(guard('hello')).toBe(false);
	});

	it('optional', () => {
		const guard = is.optional(is.number);
		expect(guard(123)).toBe(true);
		expect(guard(undefined)).toBe(true);
		expect(guard(null)).toBe(false);
		expect(guard('hello')).toBe(false);
	});

	it('nullish', () => {
		const guard = is.nullish(is.number);
		expect(guard(123)).toBe(true);
		expect(guard(null)).toBe(true);
		expect(guard(undefined)).toBe(true);
		expect(guard('hello')).toBe(false);
	});

	describe('after transforms', () => {
		it('nullable preserves transformed values and does not transform null', () => {
			const transform = vi.fn((value: string) => value.length);
			const guard = is.string.transform(transform).nullable;

			expect(guard.parse('hello').unwrap()).toBe(5);
			expect(guard.parse(null).unwrap()).toBeNull();
			expect(guard.assert(null)).toBeNull();
			expect(guard(undefined)).toBe(false);
			expect(transform).toHaveBeenCalledTimes(1);
		});

		it('optional preserves transformed values and does not transform undefined', () => {
			const transform = vi.fn((value: string) => value.length);
			const guard = is.string.transform(transform).optional;

			expect(guard.parse('hello').unwrap()).toBe(5);
			expect(guard.parse(undefined).unwrap()).toBeUndefined();
			expect(guard.assert(undefined)).toBeUndefined();
			expect(guard(null)).toBe(false);
			expect(transform).toHaveBeenCalledTimes(1);
		});

		it('nullish preserves transformed values and bypasses both nullish inputs', () => {
			const transform = vi.fn((value: string) => value.length);
			const guard = is.string.transform(transform).nullish;

			expect(guard.parse('hello').unwrap()).toBe(5);
			expect(guard.parse(null).unwrap()).toBeNull();
			expect(guard.parse(undefined).unwrap()).toBeUndefined();
			expect(guard.assert(null)).toBeNull();
			expect(guard.assert(undefined)).toBeUndefined();
			expect(transform).toHaveBeenCalledTimes(1);
		});

		it('works through the nullable, optional, and nullish factory forms', () => {
			const transformed = is.string.transform(value => value.length);

			expect(is.nullable(transformed).parse('hello').unwrap()).toBe(5);
			expect(is.nullable(transformed).parse(null).unwrap()).toBeNull();
			expect(is.optional(transformed).parse('hello').unwrap()).toBe(5);
			expect(is.optional(transformed).parse(undefined).unwrap()).toBeUndefined();
			expect(is.nullish(transformed).parse('hello').unwrap()).toBe(5);
			expect(is.nullish(transformed).parse(null).unwrap()).toBeNull();
			expect(is.nullish(transformed).parse(undefined).unwrap()).toBeUndefined();
		});

		it('preserves a multi-step transform pipeline', () => {
			const guard = is.string
				.transform(value => value.trim())
				.transform(value => value.length)
				.nullish;

			expect(guard.parse('  hello  ').unwrap()).toBe(5);
			expect(guard.parse(null).unwrap()).toBeNull();
			expect(guard.parse(undefined).unwrap()).toBeUndefined();
		});
	});
});
