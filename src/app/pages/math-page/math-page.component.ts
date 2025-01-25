import { Component, Input } from '@angular/core'
import { ContentPageComponent } from '../../common/content-page/content-page.component'
import { ColorScheme } from '../../model/ColorScheme'

@Component({
  selector: 'math-page',
  imports: [ContentPageComponent],
  templateUrl: './math-page.component.html',
  styleUrl: './math-page.component.scss',
})
export class MathPageComponent {
  @Input() title = 'Matematiske regler og begreber'
  @Input() bodyText?: string
  readonly ColorScheme = ColorScheme

  mathRules = [
    {
      name: 'Matrix multiplication',
      formula:
        'AB=C -> C_{ij} = Sigma(n_l=1) a_{il}b_{lj}= +a_{i1}b_{1j}...+a_{in}b_{nj}(i=1...k;j=1...p)when order-A=(k x n) orderB(n x p)',
    },
    { name: 'Matrix transpose', formula: '1.st row becomes 1.st col, 2.nd row -> 2.nd col ...' },
    { name: 'Matrix transpose properties', formula: '' },
    { name: '(-1)', formula: '(A^T)^T=A ' },
    { name: '(-2)', formula: '(lambdaA)^T=lambdaA^T ' },
    { name: '(-3)', formula: ' (A+B)^T=A^T+B^T ' },
    { name: '(-4)', formula: ' (A+B+C)^T=A^T+B^T+C^T ' },
    { name: '(-5)!!', formula: ' (AB)^T=B^TA^T ' },
    { name: '(-6)!!', formula: ' (ABC)^T=C^TB^TA^T ' },
    { name: 'Row reduced form when', formula: 'note: a zero row is a row that contains only zeroes [0000]' },
    {
      name: '(R1)',
      formula: 'when matrix contains both nonzero- and zeroe-rows, all zeo-rows apear under all nonzero-rows',
    },
    { name: '(R2)', formula: 'the first nonzero element in any nonzero-row is of value 1: [0 0 1 4 3]' },
    {
      name: '(R3)',
      formula:
        'All elements directly below the first nonzero element are 0 , the column has only zeroes below first nonzero element',
    },
    {
      name: '(R4)',
      formula:
        'the first nonzero element in any nonzero-row is left of previous first nonzero elements: r1[1234] r2[0123] r3[0012] ',
    },
    { name: 'Diagonal matrix', formula: 'only the diagonal contains nonzero numbers: r1[100]r2[060]r3[002]' },
    { name: 'Zero matrix', formula: 'all zeroes also the diagonal: r1[000]r2[000]r3[000]' },
    {
      name: 'Identity matrix I',
      formula: "the diagonal matrix, containing only 1's in its diagonal: r1[100]r2[010]r3[001]",
    },
    { name: '(-1)', formula: 'AI=A ' },
    { name: '(-2)', formula: 'IA=A ' },
    { name: 'Symmetrix matrix', formula: 'A=A^T : r1[123]r2[245]r3[356]' },
    { name: 'Skew symmetrix matrix', formula: '-A=A^T : r1[0 2 -3]r2[-2 0 1]r3[3 -1 0]' },
    { name: 'Lower triangular matrix', formula: 'a_{ij}=0 for j>i' },
    { name: '(-1)', formula: 'product of two Lower triangular matrices is also a Lower triangular matrix' },
    { name: 'Upper triangular matrix', formula: 'a_{ij}=0 for i>j' },
    { name: '(-1)', formula: 'product of two Upper triangular matrices is also a Upper triangular matrix' },
  ]
}
