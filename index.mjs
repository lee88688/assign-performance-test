import { Bench } from 'tinybench'
import objectWithoutProperties from '@babel/runtime/helpers/esm/objectWithoutProperties'
import { generateTheme } from './theme.mjs'

const excluded = ["stylish", "appearance", "isDarkMode", "prefixCls", "iconPrefixCls"]

function objectWithoutPropertiesDelete(obj, excluded) {
    const newObj = Object.assign({}, obj)
    for (let i = 0; i < excluded.length; i++) {
      delete newObj[excluded[i]]
    }
    return newObj
  }

function useBabel(theme) {
    var stylish = theme.stylish,
        appearance = theme.appearance,
        isDarkMode = theme.isDarkMode,
        prefixCls = theme.prefixCls,
        iconPrefixCls = theme.iconPrefixCls,
        token = objectWithoutProperties(theme, excluded);
    
    return {stylish, appearance, isDarkMode, prefixCls, iconPrefixCls, token}
}

function useNative(theme) {
    const { stylish, appearance, isDarkMode, prefixCls, iconPrefixCls, ...token} = theme

    return {stylish, appearance, isDarkMode, prefixCls, iconPrefixCls, token}
}

function useDelete(theme) {
    var stylish = theme.stylish,
        appearance = theme.appearance,
        isDarkMode = theme.isDarkMode,
        prefixCls = theme.prefixCls,
        iconPrefixCls = theme.iconPrefixCls;
    const token = objectWithoutPropertiesDelete(theme, excluded)
    return {stylish, appearance, isDarkMode, prefixCls, iconPrefixCls, token}
}

function useShalloCopy(theme) {
    var stylish = theme.stylish,
        appearance = theme.appearance,
        isDarkMode = theme.isDarkMode,
        prefixCls = theme.prefixCls,
        iconPrefixCls = theme.iconPrefixCls;
    var token = Object.assign({}, theme)
    return {stylish, appearance, isDarkMode, prefixCls, iconPrefixCls, token}
}

const theme10Percent = generateTheme(0.1)
console.log(`10 percent theme has ${theme10Percent.total} keys`)
const theme30Percent = generateTheme(0.3)
console.log(`30 percent theme has ${theme30Percent.total} keys`)
const theme50Percent = generateTheme(0.5)
console.log(`50 percent theme has ${theme50Percent.total} keys`)
const theme70Percent = generateTheme(0.7)
console.log(`70 percent theme has ${theme70Percent.total} keys`)
const theme100Percent = generateTheme(1)
console.log(`100 percent theme has ${theme100Percent.total} keys`)

const themes = [theme10Percent, theme30Percent, theme50Percent, theme70Percent, theme100Percent]

for (const t of themes) {
    const bench = new Bench({ time: 5000 })
    bench
        .add('babel', () => {
            useBabel(t.theme)
        })
        .add('native', () => {
            useNative(t.theme)
        })
        .add('delete', () => {
            useDelete(t.theme)
        })
        .add('shallow copy', () => {
            useShalloCopy(t.theme)
        })

    await bench.warmup()
    await bench.run()
    
    const table = bench.table()
    const babelResult = bench.getTask('babel').result
    for (const t of table) {
        const name = t['Task Name']
        const result = bench.getTask(name).result
        const relativePercent = (result.mean - babelResult.mean) / babelResult.mean * 100
        t['Relative To babel'] = `${relativePercent.toFixed(2)}%`
    }

    console.log('\n', t.message, `total ${t.total} properties`)
    console.table(table)
}
