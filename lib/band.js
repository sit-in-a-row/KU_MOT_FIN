export function makeBandPostText({ date, participants, amount, bank, account, holder }) {
  return [
    '안녕하세요.',
    '원우회 식비지원 요청드립니다.',
    `• 일시 : ${date || ''}`,
    `• 대상 : ${participants || ''}`,
    `• 금액 : ${amount ? Number(amount).toLocaleString('ko-KR') + '원' : ''}`,
    `• 계좌번호 : ${bank ? `(${bank}) ` : ''}${account || ''}${holder ? ` (${holder})` : ''}`,
    '',
    '영수증 사진',
    '참석인원 사진',
  ].join('\n');
}
