(function () {
  'use strict';

  const PERIODS = [3, 5, 10];
  const monthlyInput = document.getElementById('monthly-amount');
  const rateInput = document.getElementById('annual-rate');
  const result3y = document.getElementById('result-3y');
  const result5y = document.getElementById('result-5y');
  const result10y = document.getElementById('result-10y');
  const breakdownList = document.getElementById('breakdown-list');

  const resultElements = {
    3: result3y,
    5: result5y,
    10: result10y
  };

  function calculateFutureValue(monthlyAmount, annualRatePercent, years) {
    const r = annualRatePercent / 100;
    const months = years * 12;

    if (r === 0) {
      return monthlyAmount * months;
    }

    const monthlyRate = r / 12;
    return monthlyAmount * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
  }

  function formatAmount(value) {
    if (value == null || isNaN(value) || value < 0) return '-';
    return value.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) + '원';
  }

  function updateResults() {
    const monthlyAmount = parseFloat(monthlyInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;

    if (monthlyAmount <= 0) {
      PERIODS.forEach((years) => {
        resultElements[years].textContent = '-';
      });
      breakdownList.innerHTML = '<li>월 저축액을 입력해 주세요.</li>';
      return;
    }

    const results = {};
    PERIODS.forEach((years) => {
      const fv = calculateFutureValue(monthlyAmount, annualRate, years);
      results[years] = fv;
      resultElements[years].textContent = formatAmount(fv);
    });

    breakdownList.innerHTML = PERIODS.map((years) => {
      const fv = results[years];
      const totalPaid = monthlyAmount * 12 * years;
      const interestEarned = fv - totalPaid;
      return (
        '<li>' +
        years +
        '년: 총 납입 ' +
        formatAmount(totalPaid) +
        ', 이자 수익 ' +
        formatAmount(interestEarned) +
        '</li>'
      ).trim();
    }).join('');
  }

  function onInputChange() {
    updateResults();
  }

  monthlyInput.addEventListener('input', onInputChange);
  monthlyInput.addEventListener('change', onInputChange);
  rateInput.addEventListener('input', onInputChange);
  rateInput.addEventListener('change', onInputChange);

  updateResults();
})();
