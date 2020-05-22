const get_helpers = require('../get_helpers.js');

describe('_load_get', () => {
    var empty = {};
    it('returns empty for empty query', () => {
        expect(get_helpers._load_get('ahkgen.com/'))
            .toEqual(empty);
    });

    it('takes values into object', () => {
        expect(get_helpers._load_get('ahkgen.com/?length=0'))
            .toEqual({ 'length': "0" });
    });

    it('takes array values into array', () => {
        expect(get_helpers._load_get('ahkgen.com/?skey0%5B%5D=CTRL&skey0%5B%5D=ALT'))
            .toEqual({ 'skey0[]': ['CTRL', 'ALT'] })
    });

    it('takes index array and turns into array', () => {
        expect(get_helpers._load_get('ahkgen.com/?indexes=0'))
            .toEqual({ 'indexes': '0' })
    });

    it('takes url with extra spaces and trims them', () => {
        expect(get_helpers._load_get('ahkgen.com/?   indexes=0'))
            .toEqual({ 'indexes': '0' })
    });

    it('takes url with url escaped spaces and keeps them', () => {
        expect(get_helpers._load_get('ahkgen.com/?+++indexes=0'))
            .toEqual({ '   indexes': '0' })
    });

    it('take a url and does not strip values', () => {
        expect(get_helpers._load_get('ahkgen.com/?+++indexes=+'))
            .toEqual({ '   indexes': ' ' })
    });

    it('takes duplicate values into array', () => {
        expect(get_helpers._load_get('ahkgen.com/?skey0=CTRL&skey0=ALT'))
            .toEqual({ 'skey0': ['CTRL', 'ALT'] })
    });

    it('takes a basic query and returns expected data', () => {
        const result = get_helpers
            ._load_get('ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Replace');
        expect(result).toMatchSnapshot();
    })

    it('takes data in regardless of values', () => {
        const result = get_helpers
            ._load_get('ahkgen.com/?length=1&comment5=&func5=KEY&skeyValue5=a&input5=b&option5=Replace');
        expect(result).toMatchSnapshot();
    });

    it('takes no issue with an indexes query', () => {
        const result = get_helpers
        ._load_get(
            'ahkgen.com/?indexes=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
        );
        expect(result).toMatchSnapshot();
    })
})
