import _ from "lodash";

export const trig = [
    {
        "string": "f'(x,y)={x^2 \\over y^2} + \\sum_{i=1}^{100}x^2",
        "math": true,
        "alt": "",
    },
    {
        "string": "\\cos\\left(x\\right)=\\sum_{n=0}^\\infty\\pm\\dotsb",
        "math": true,
        "alt": "",
    },
    {
        "string": "\\sum_{n=0}^\\infty",
        "math": true,
        "alt": "",
    },
    {
        "string": "\\sin\\left(2\\alpha\\right)=2\\sin\\left(\\alpha\\right)\\cos\\left(\\alpha\\right)",
        "math": true,
        "alt": "����� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\cos \\left(2\\alpha \\right)=\\cos ^2\\left(\\alpha \\right)-\\sin ^2\\left(\\alpha \\right)",
        "math": true,
        "alt": "������� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\sin \\left(\\alpha \\pm \\beta \\right)=\\sin \\left(\\alpha \\right)\\cos \\left(\\beta \\right)\\pm \\cos \\left(\\alpha \\right)\\sin \\left(\\beta \\right)",
        "math": true,
        "alt": "����� ����� ������",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\cos \\left(\\alpha \\pm \\beta \\right)=\\cos \\left(\\alpha \\right)\\cos \\left(\\beta \\right)\\mp \\sin \\left(\\alpha \\right)\\sin \\left(\\beta \\right)",
        "math": true,
        "alt": "������� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\sin \\left(\\alpha \\right)\\pm \\sin \\left(\\beta \\right)=2\\sin \\left(\\frac{\\alpha \\pm \\beta }{2}\\right)2\\cos \\left(\\frac{\\alpha \\mp \\beta }{2}\\right)",
        "math": true,
        "alt": "����� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\cos \\left(\\alpha \\right)+\\cos \\left(\\beta \\right)=2\\cos \\left(\\frac{\\alpha +\\beta }{2}\\right)2\\cos \\left(\\frac{\\alpha -\\beta }{2}\\right)",
        "math": true,
        "alt": "������� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\cos \\left(\\alpha \\right)-\\cos \\left(\\beta \\right)=-2\\sin \\left(\\frac{\\alpha +\\beta }{2}\\right)2\\sin \\left(\\frac{\\alpha -\\beta }{2}\\right)",
        "math": true,
        "alt": "������� ����� �����",
        "parents": { "-LAsMZHiyhcq8DvIgI2U": 0 }
    },
    {
        "string": "\\frac{a}{\\sin \\left(\\alpha \\right)}=\\frac{b}{\\sin \\left(\\beta \\right)}=\\frac{c}{\\sin \\left(\\gamma \\right)}=2R",
        "math": true,
        "alt": "���� �����",
        "parents": { "-LAsMZHhdvp3WJiFBp4r": 0 }
    },
    {
        "string": "c^2=a^2+b^2-2ab\\cos \\left(\\gamma \\right)",
        "math": true,
        "alt": "���� �������",
        "parents": { "-LAsMZHhdvp3WJiFBp4r": 0 }
    },
    {
        "string": "S_{\\triangle }=\\frac{ab\\sin \\left(\\gamma \\right)}{2}",
        "math": true,
        "alt": "��� �����",
        "parents": { "-LAsMZHhdvp3WJiFBp4r": 0 }
    }
];

export const calculus = [
    {
        "string": "f'\\left(x\\right)=0",
        "math": true,
        "alt": "�����",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "f''\\left(x\\right)=0",
        "math": true,
        "alt": "�����",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "\\left(\\frac{f\\left(x\\right)}{g\\left(x\\right)}\\right)'=\\frac{f'\\left(x\\right)g\\left(x\\right)-g'\\left(x\\right)f\\left(x\\right)}{g^2\\left(x\\right)}",
        "math": true,
        "alt": "����� �� �������� ���",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "\\left(f\\left(x\\right)g\\left(x\\right)\\right)'=f'\\left(x\\right)g\\left(x\\right)+g'\\left(x\\right)f\\left(x\\right)",
        "math": true,
        "alt": "����� �� �������� ���",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "\\left(f\\left(g\\left(x\\right)\\right)\\right)'=f'\\left(g\\left(x\\right)\\right)\\cdot g'\\left(x\\right)",
        "math": true,
        "alt": "����� �� ������� ������",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "\\left(x^n\\right)'=n\\cdot x^{n-1}",
        "math": true,
        "alt": "����� �� �������� �������",
        "parents": { "-LAsMZHgej2TmHNkvpqC": 0 }
    },
    {
        "string": "����������",
        "math": false,
        "parents": { "-LAsMZHfNgCQuq6Kasmv": 0 }
    }
]

export const chemistry = [
    `\\documentclass{article}
                \\usepackage[version = 3]{ mhchem }
                \\begin{ document }
                \\noindent IUPAC recommendation: \\\\
                \\ce{ 2H + (aq) + CO3 ^ { 2-}(aq) -> CO2(g) + H2O(l) }

                \\bigskip

                \\noindent Subscript: \\\\
                \\ce{ 2H + {}_{ (aq) } + CO3 ^ { 2-}{ } _{ (aq) } -> CO2{ } _{ (g) } + H2O{ } _{ (l) } }
                \\end{ document }`,
    `\\ce{ 2H + (aq) + CO3 ^ { 2-}(aq) -> CO2(g) + H2O(l) }`,
    `\\ce{ 2H + {}_{ (aq) } + CO3 ^ { 2-}{ } _{ (aq) } -> CO2{ } _{ (g) } + H2O{ } _{ (l) } }`
];

export const math = [
    'x_{1,2}=\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}',
    `f'\\left(x\\`
];

export function getTaylor(n: number) {
    const exp = _.map(new Array(n + 1), (val, index) => index + 2);
    const rest = exp.map((val) => `{\\frac {x^{${val}}}{${val}!}}`).join('+');
    return `{\\displaystyle e^{x}=\\sum _{n=0}^{\\infty }{\\frac {x^{n}}{n!}}=1+x+${rest}+\\cdots }`;
}

export function getFrac(a: number | string, b: number | string) {
    return `\\frac{${a}}{${b}}`;
}

export function getRecursiveFrac(n: number) {
    return _.reduce(_.fill(new Array(n + 1), 0), (acc, val, index) => getFrac(acc, index + 1), `x^{${n + 1}}`);
}

export default {
    trig: _.map(_.filter(trig, 'math'), 'string'),
    calculus: _.map(_.filter(calculus, 'math'), 'string'),
    chemistry,
    math
}