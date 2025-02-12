<!DOCTYPE html>
<html>
<head>
  <style>
    .command-box {
      position: fixed;
      top: 20px;
      left: 20px;
      background-color: #f5f5dc;  /* beige */
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
      width: 80px;
      height: 40px;  /* increased to accommodate two lines */
      overflow: hidden;
      transition: all 0.3s ease;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      z-index: 1000;
      color: #666;  /* grey text */
    }

    .command-box:hover {
      width: 600px;
      height: 400px;
      overflow-y: auto;
      background-color: #f5f5dc;  /* beige */
    }

    .command-box .title {
      text-align: center;
      line-height: 1.2;
      margin: 0;
    }

    .command-box .title span {
      display: block;
      font-size: 14px;
      font-weight: bold;
    }

    .command-box .content {
      display: none;
      margin-top: 15px;
      font-size: 14px;
      line-height: 1.5;
    }

    .command-box:hover .content {
      display: block;
    }

    .command-box pre {
      background-color: #f0f0f0;
      padding: 4px 8px;
      border-radius: 4px;
      display: inline;
      font-family: monospace;
      color: #666;  /* grey text */
    }

    .command-box ul {
      margin: 10px 0;
      padding-left: 20px;
    }

    .command-box li {
      margin-bottom: 8px;
    }

    .command-box h3 {
      margin: 10px 0;
      font-size: 16px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="command-box">
    <div class="title">
      <span>USER</span>
      <span>COMMANDS</span>
    </div>
    <div class="content">
      <h3>Commands:</h3>
      <ul>
        <li><pre>*n</pre> or <pre>xn</pre> - Multiply both sides by a number (also negatives, eg x-3)</li>
        <li><pre>*n/m</pre> or <pre>xn/m</pre> - Multiply by a fraction (eg *-1/4)</li>
        <li><pre>/n</pre> - Divide by a number</li>
        <li><pre>lhs*()n/m</pre> - Multiply left bracket by n/m (also 'rhs', 'x', 'br', integer and negative inputs, eg rhsxbr-4)</li>
        <li><pre>lhs/n,/n</pre> - Simplifies fraction on left side (also 'rhs')</li>
        <li><pre>a/b=c/d</pre> - Replaces any seen fraction with an equivalent fraction (also <pre>n/m=p</pre> and <pre>n=p/q</pre>)</li>
      </ul>
      <h3>Additional commands when brackets are removed:</h3>
      <ul>
        <li><pre>+n</pre>, <pre>-n</pre>, <pre>+n/m</pre>, <pre>-n/m</pre> - Add or subtract a constant to both sides</li>
        <li><pre>+nx</pre>, <pre>-nx</pre>, <pre>+n/mx</pre>, <pre>-n/mx</pre> - Add or subtract a term with x (eg -4/5x)</li>
      </ul>
    </div>
  </div>
</body>
</html>
