import { MissionUtils } from '@woowacourse/mission-utils';
import { getUserInput } from './views/CalculatorView.js';
import { parseNumbers, calculate } from './models/CalculatorModel.js';

// View 테스트
describe('문자열 계산기 View', () => {
  test('사용자 입력', () => {
    const consoleSpy = jest
      .spyOn(MissionUtils.Console, 'readLineAsync')
      .mockImplementation(() => Promise.resolve('1,2:3'));

    getUserInput((input) => {
      expect(input).toBe('1,2:3');
    });
    consoleSpy.mockRestore();
  });
});

// model 테스트
describe('문자열 계산기 model', () => {
  test('기본 구분자로 구분된 숫자 파싱', () => {
    const result = parseNumbers('4,5,6,7:8:9');
    expect(result).toEqual([4, 5, 6, 7, 8, 9]);
  });
  test('커스텀 구분자로 구분된 숫자 파싱', () => {
    const inputNum = '//!\\n4!5!6!7!8';
    const result1 = parseNumbers(inputNum);
    expect(result1).toEqual([4, 5, 6, 7, 8]);
  });

  test('커스텀 구분자와 기본 구분자 혼용된 숫자 파싱', () => {
    const result = parseNumbers('//!\\n4,5,6,7!8:9');
    expect(result).toEqual([4, 5, 6, 7, 8, 9]);
  });

  test('에러 발생 시 프로그램 종료 테스트', () => {
    try {
      parseNumbers('1.2,3'); // 구분자가 잘못된 입력으로 에러 발생 예상
    } catch (error) {
      expect(error.message).toBe(
        '[ERROR] : 구분자가 아닌 문자는 입력할 수 없습니다.',
      );
      // 에러 발생 후 추가 로직이 없으면 사실상 프로그램 종료
    }
  });

  test('계산', () => {
    const result2 = calculate('5, 6');
    expect(result2).toEqual(11);
  });
  test('0이 1개 이상 입력되면 오류', () => {
    try {
      parseNumbers('00,1,2,3'); // 구분자가 잘못된 입력으로 에러 발생 예상
    } catch (error) {
      expect(error.message).toBe('[ERROR] : 0은 입력할 수 없습니다.');
      // 에러 발생 후 추가 로직이 없으면 사실상 프로그램 종료
    }
  });

  test('빈문자열 0반환', () => {
    const result = calculate('');
    expect(result).toBe(0);
  });
});
