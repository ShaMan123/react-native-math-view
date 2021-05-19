import * as _ from 'lodash';
import { MathToSVGConfig, mathToSVGDefaultConfig } from './Config';
import { Memoize } from './Util';
import MathjaxAdaptor from './MathjaxAdaptor';

/** 
 *  ************************************************************************************
 *  lodash pulls the memoized value faster 
 *  ************************************************************************************
 * */
const useLodashMem = true;

/** custom memoization */
class AdaptorMemoize extends Memoize {
    cache: Array<{ config: MathToSVGConfig, adaptor: MathjaxAdaptor }> = [];
    cached(config: MathToSVGConfig) {
        const item = _.find(this.cache, (item) => _.isEqual(config, item));
        return _.get(item, 'adaptor');
    }

    get(config: MathToSVGConfig) {
        const cached = this.cached(config);
        if (_.isNil(cached)) {
            const adaptor = new MathjaxAdaptor(config);
            this.cache.push({ config, adaptor });
            return adaptor;
        }
        else {
            return cached;
        }
    }
}

const memoize = new AdaptorMemoize();
/** use custom memoize */
const IFactoryMemoize = _.set(memoize.get.bind(memoize), 'cache', memoize);

/** 
 *  use lodash built in memoization
 *  requires JSON stringfy/parse
 * */
const LFactoryMemoize = _.memoize((stringifiedOptions: string) => new MathjaxAdaptor(JSON.parse(stringifiedOptions) as MathToSVGConfig));

/** MathjaxAdaptor Factory memoize */
export const FactoryMemoize = useLodashMem ? LFactoryMemoize : IFactoryMemoize as (typeof LFactoryMemoize | typeof IFactoryMemoize) & _.MemoizedFunction;

function parseConfig(config?: Partial<MathToSVGConfig>) {
    const options = _.defaultsDeep(config || {}, mathToSVGDefaultConfig) as MathToSVGConfig;
    return useLodashMem ? JSON.stringify(options) : options;
}

export default function MathjaxFactory(config?: Partial<MathToSVGConfig>) {
    return FactoryMemoize(parseConfig(config));
}

/** call MathjaxFactory to create and cache an instance of @class {MathjaxAccessor} for future use */
export const mathjaxGlobal = MathjaxFactory();