import type {BrandBase, BrandBuilder, BrandBuilderOptions, Branded} from '/lib/app-metafields/types/Branded';


export function brand<T extends Branded<Base, any>, Base = BrandBase<T>>(
	{
		validate = () => true,
	}: BrandBuilderOptions<Base> = {}
): BrandBuilder<T, Base> {
	function assertIsBrand(value: Base): asserts value is T {
		const result = validate(value)
		if (typeof result === 'string') {
			throw new TypeError(result)
		}
		if (result === false) {
			throw new TypeError(`Invalid value ${value}`)
		}
	}

	return {
		check: (value): value is T => validate(value) === true,
		assert: assertIsBrand,
		from: (value: Base) => {
			assertIsBrand(value)
			return value as T
		},
	}
}
