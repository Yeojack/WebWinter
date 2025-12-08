// DOM 요소 선택 (const 사용)
const $input = document.querySelector("#guess-input");
const $submitButton = document.querySelector("#submit-button");
const $message = document.querySelector("#message");
const $resultList = document.querySelector("#result-list");
const $resetButton = document.querySelector("#reset-button");

// 전역 변수
let answer = []; // 컴퓨터의 정답 (배열)
let tries = 0; // 시도 횟수

//정답 생성
const createAnswer = () => {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const target = [];
  for (let i = 0; i < 3; i++) {
    // 무작위 숫자 선택 후 제거 (중복 방지)
    const index = Math.floor(Math.random() * numbers.length);
    target.push(numbers[index]);
    numbers.splice(index, 1);
  }
  return target;
};

// 게임 초기화 함수
const initGame = () => {
  answer = createAnswer();
  tries = 0;

  // DOM 조작: 초기화
  $resultList.innerHTML = "";
  $message.textContent = "게임을 시작합니다! 3 Strike를 달성하세요.";
  $input.value = "";
  $input.disabled = false;
  $submitButton.disabled = false;
  $resetButton.style.display = "none";
  $input.focus();

  console.log("정답 (개발자용):", answer.join(""));
};

// 입력 유효성 검사
const checkInput = (input) => {
  if (input.length !== 3) {
    $message.textContent = "⛔ 3자리 숫자를 입력해야 합니다.";
    return false;
  }
  // Set을 이용한 중복 확인
  if (new Set(input).size !== 3) {
    $message.textContent = "⛔ 중복되지 않는 숫자를 입력해야 합니다.";
    return false;
  }
  if (isNaN(input) || input.includes("0")) {
    $message.textContent = "⛔ 1~9 사이의 숫자만 입력해야 합니다 (0 제외).";
    return false;
  }
  return true;
};

// 결과 판정
const getResult = (guessArr) => {
  let strike = 0;
  let ball = 0;

  guessArr.forEach((digit, index) => {
    const answerIndex = answer.indexOf(digit);

    if (answerIndex === index) {
      strike++; // 위치와 숫자가 모두 같음
    } else if (answerIndex > -1) {
      ball++; // 숫자는 같지만 위치가 다름
    }
  });

  return { strike, ball };
};

//게임 종료 처리 함수
const endGame = (isWin) => {
  $input.disabled = true;
  $submitButton.disabled = true;
  $resetButton.style.display = "block";

  // 최종 메시지 색상 변경
  $message.style.color = isWin ? "#4CAF50" : "#f44336";
};

//  제출 이벤트 핸들러
const handleSubmit = (event) => {
  event.preventDefault();
  const guess = $input.value.trim();

  // 유효성 검사
  if (!checkInput(guess)) {
    $input.value = "";
    return;
  }

  // 문자열을 숫자 배열로 변환
  const guessArr = [...guess].map(Number);

  tries++;

  // 결과 판정 및 구조 분해 할당
  const { strike, ball } = getResult(guessArr);

  // 3 Strike 승리 조건
  if (strike === 3) {
    $message.textContent = `🎉 축하합니다! 정답 ${answer.join(
      ""
    )} (${tries}번 시도) 🎉`;
    endGame(true);
    return;
  }

  // 결과 출력
  const $listItem = document.createElement("li");
  let resultText = "";

  if (strike === 0 && ball === 0) {
    resultText = "아웃 (Out)";
  } else {
    resultText = `${strike} 스트라이크, ${ball} 볼`;
  }

  $listItem.textContent = `[${tries}회] ${guess} => ${resultText}`;
  $resultList.prepend($listItem); // 최신 결과를 목록 맨 위에 추가

  // 입력 필드 초기화 및 포커스
  $input.value = "";
  $input.focus();
  $message.textContent = "다시 시도하세요.";
  $message.style.color = "#ffeb3b"; // 기본 색상으로 복귀

  // 최대 시도 횟수 초과 시 패배
  if (tries >= 10) {
    $message.textContent = `❌ 실패! 10번의 기회를 모두 사용했습니다. 정답은 ${answer.join(
      ""
    )}였습니다.`;
    endGame(false);
  }
};

// 이벤트 리스너
$resetButton.addEventListener("click", initGame);
$submitButton.addEventListener("click", handleSubmit);

// Enter 키로 제출 가능
$input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !$input.disabled) {
    handleSubmit(e);
  }
});

// 게임 시작
initGame();
