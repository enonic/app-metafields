import type {BrandBase, BrandBuilder, BrandBuilderOptions, Branded} from '/lib/brand.d';


function brand<T extends Branded<Base, any>, Base = BrandBase<T>>({
	validate = () => true,
}: BrandBuilderOptions<Base> = {}): BrandBuilder<T, Base> {
	function assertIsBrand(value: Base): asserts value is T {
		const result = validate(value)
		if (typeof result === 'string') {
			throw new Error(result)
		}
		if (result === false) {
			throw new Error(`Invalid value ${value}`)
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
