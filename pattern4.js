"use strict";

let velocityA = 0;
let velocityB = 0;
let animationStart = false;
let posA = 0;
let posB = 0;
let v_result = "";
let t_unit = "";
let delaytime = 0;
let delay_result = "";
let startFrame;

document.getElementById("calculation").addEventListener("click", calculate);
document.getElementById("clear").addEventListener("click", clearFields);

function calculate() {
  velocityA = parseFloat(document.getElementById("velocityA").value);
  velocityB = parseFloat(document.getElementById("velocityB").value);
  delaytime = parseFloat(document.getElementById("delaytime").value);
  t_unit = document.getElementById("t_unit").value;
  const vA_unit = document.getElementById("vA_unit").value;
  const vB_unit = document.getElementById("vB_unit").value;

  const vA_output = document.getElementById("vA_output");
  const vB_output = document.querySelectorAll(".vB_output");

  const vA_unit_output = document.getElementById("vA_unit_output");
  const vB_unit_output = document.querySelectorAll(".vB_unit_output");
  const delay_unit = document.getElementById("delay_unit").value;
  const delay_output = document.querySelectorAll(".delay_output");
  const delay_unit_output = document.querySelectorAll(".delay_unit_output");
  startFrame = frameCount;

  //アウトプットに値の読み取り

  if (velocityA) {
    vA_output.value = velocityA;
  }
  if (velocityB) {
    vB_output.forEach((element) => {
      element.value = velocityB;
    });
  }
  if (delaytime) {
    delay_output.forEach((element) => {
      element.value = delaytime;
    });
  }
  //アウトプットに単位の読み取り
  vA_unit_output.textContent = vA_unit;
  vB_unit_output.forEach((element) => {
    element.textContent = vB_unit;
  });
  delay_unit_output.forEach((element) => {
    element.textContent = delay_unit;
  });

  // 単位を揃える
  if (t_unit === "時間") {
    if (vA_unit === "m/min") {
      velocityA *= 0.06;
    } else if (vA_unit === "m/s") {
      velocityA *= 3.6;
    }
    if (vB_unit === "m/min") {
      velocityB *= 0.06;
    } else if (vB_unit === "m/s") {
      velocityB *= 3.6;
    }
    if (delay_unit === "分") {
      delaytime /= 60;
    } else if (delay_unit === "秒") {
      delaytime /= 3600;
    }
  } else if (t_unit === "分") {
    if (vA_unit === "km/h") {
      velocityA = (velocityA * 1000) / 60;
    } else if (vA_unit === "m/s") {
      velocityA *= 60;
    }
    if (vB_unit === "km/h") {
      velocityB = (velocityB * 1000) / 60;
    } else if (vB_unit === "m/s") {
      velocityB *= 60;
    }
    if (delay_unit === "時間") {
      delaytime *= 60;
    } else if (delay_unit === "秒") {
      delaytime /= 60;
    }
  } else if (t_unit === "秒") {
    if (vA_unit === "km/h") {
      velocityA = (velocityA * 1000) / 3600;
    } else if (vA_unit === "m/min") {
      velocityA /= 60;
    }
    if (vB_unit === "km/h") {
      velocityB = (velocityB * 1000) / 3600;
    } else if (vB_unit === "m/min") {
      velocityB /= 60;
    }
    if (delay_unit === "時間") {
      delaytime *= 3660;
    } else if (delay_unit === "分") {
      delaytime *= 60;
    }
  }

  if (isNaN(velocityA) || isNaN(velocityB) || isNaN(delaytime)) {
    document.getElementById("result").textContent =
      "速さA、速さB、遅延時間を入力してください。";
    animationStart = false;
    noLoop(); // アニメーションを停止
    return;
  }
  if (velocityA <= velocityB) {
    document.getElementById("result").textContent =
      "速さAは速さBよりも大きい値を入力してください。";
    animationStart = false;
    noLoop(); // アニメーションを停止
    return;
  }

  //resultの単位合わせ

  if (t_unit === "時間") {
    v_result = "km/h";
    delay_result = "時間";
  } else if (t_unit === "分") {
    v_result = "m/min";
    delay_result = "分";
  } else if (t_unit === "秒") {
    v_result = "m/s";
    delay_result = "秒";
  }

  document.getElementById("result").textContent = `(${velocityB.toFixed(
    2
  )}${v_result} × ${delaytime.toFixed(
    2
  )}${delay_result}) ÷ (${velocityA.toFixed(2)}${v_result}- ${velocityB.toFixed(
    2
  )}${v_result})+${delaytime.toFixed(2)}${delay_result} = ${(
    (velocityB * delaytime) / (velocityA - velocityB) +
    delaytime
  ).toFixed(2)} ${t_unit}後`;

  // アニメーションの開始
  animationStart = true;

  posA = 100; // Aの初期位置
  posB = 200; // Bの初期位置

  loop(); // p5.jsのアニメーションを再スタート
}

function clearFields() {
  // 入力をクリア
  document.getElementById("velocityA").value = "";
  document.getElementById("velocityB").value = "";
  document.getElementById("delaytime").value = "";
  document.getElementById("result").textContent = "";
  // アウトプットをクリア
  document.getElementById("vA_output").value = "";
  document.querySelectorAll(".vB_output").forEach((element) => {
    element.value = "";
  });
  document.getElementById("vA_unit_output").textContent = "";
  document.querySelectorAll(".vB_unit_output").forEach((element) => {
    element.textContent = "";
  });
  document.querySelectorAll(".delay_output").forEach((element) => {
    element.value = "";
  });
  document.querySelectorAll(".delay_unit_output").forEach((element) => {
    element.textContent = "";
  });

  // アニメーションリセット
  animationStart = false;
  posA = 100;
  posB = 200;
  noLoop();
  redraw();
}

//ここからp5.jsの設定
function setup() {
  createCanvas(800, 400);
  background;
  posA = 100; // Aの初期位置
  posB = 200; // Bの初期位置
}

function draw() {
  background(250);

  strokeWeight(8);
  stroke(150, 150, 150);
  line(50, 300, 750, 300);

  if (animationStart) {
    let Aspeed = velocityA;
    let Bspeed = velocityB;
    if (Aspeed < 2) {
      Aspeed = velocityA * 20;
    }
    if (Bspeed < 2) {
      Bspeed = velocityB * 20;
    }

    noStroke();
    fill(150, 185, 200); // 人B
    ellipse(posA, 200, 50, 50);
    rect(posA - 25, 230, 50, 65);

    fill(155, 190, 145); // 人A
    ellipse(posB, 200, 50, 50);
    rect(posB - 25, 230, 50, 65);

    fill(0);
    textSize(20);
    text(velocityA + "" + v_result, posA - 30, 160);
    text(velocityB + "" + v_result, posB - 30, 160);

    textSize(35);
    text("A", posA - 16.5, 217.5);
    text("B", posB - 16.5, 217.5);
    // 速さに応じて位置を更新
    if (frameCount - startFrame >= 60) {
      posA += Aspeed / 10;
    }
    posB += Bspeed / 10;

    // 位置が交差したらアニメーションを止める
    if (posA - 1 >= posB) {
      fill(250);
      rect(0, 0, 800, 295);
      noStroke();
      fill(250, 130, 115);
      ellipse(posA - 1, 200, 52, 52);
      rect(posA - 27, 230, 52, 67);
      noFill();
      stroke(0);
      strokeWeight(2);
      ellipse(posA - 40, 150, 30, 30);
      line(posA - 40, 140, posA - 40, 150);
      line(posA - 40, 150, posA - 32, 150);
      fill(0);
      noStroke();
      textSize(20);
      text(
        ((velocityB * delaytime) / (velocityA - velocityB) + delaytime).toFixed(
          2
        ) +
          "" +
          t_unit +
          "後",
        posA - 20,
        160
      );
      noLoop();
      document.getElementById("result").textContent += " に出会いました！";
    }
  }
}
