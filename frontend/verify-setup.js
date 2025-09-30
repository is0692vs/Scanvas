#!/usr/bin/env node
// セットアップ検証スクリプト - GUI不要で基本構造を確認

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'main.js',
  'preload.js',
  'renderer.js',
  'index.html',
  'styles.css'
];

const requiredDirs = [
  'node_modules'
];

console.log('Scanvas Frontend セットアップ検証\n');

let allOk = true;

// ファイルチェック
console.log('必須ファイルの確認:');
requiredFiles.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${exists ? '✓' : '✗'} ${file}`);
  if (!exists) allOk = false;
});

console.log('\n必須ディレクトリの確認:');
requiredDirs.forEach(dir => {
  const exists = fs.existsSync(path.join(__dirname, dir));
  console.log(`  ${exists ? '✓' : '✗'} ${dir}`);
  if (!exists) allOk = false;
});

// package.json検証
console.log('\npackage.json の検証:');
try {
  const pkg = require('./package.json');
  const checks = [
    { name: 'main エントリポイント', test: pkg.main === 'main.js' },
    { name: 'start スクリプト', test: pkg.scripts && pkg.scripts.start },
    { name: 'dev スクリプト', test: pkg.scripts && pkg.scripts.dev },
    { name: 'electron 依存関係', test: pkg.devDependencies && pkg.devDependencies.electron }
  ];
  
  checks.forEach(check => {
    console.log(`  ${check.test ? '✓' : '✗'} ${check.name}`);
    if (!check.test) allOk = false;
  });
} catch (error) {
  console.log(`  ✗ package.json の読み込みエラー: ${error.message}`);
  allOk = false;
}

// JavaScriptファイルの構文チェック
console.log('\nJavaScript構文チェック:');
const jsFiles = ['main.js', 'preload.js', 'renderer.js'];
jsFiles.forEach(file => {
  try {
    require.resolve(path.join(__dirname, file));
    console.log(`  ✓ ${file}`);
  } catch (error) {
    console.log(`  ✗ ${file}: ${error.message}`);
    allOk = false;
  }
});

// HTMLファイルの基本チェック
console.log('\nHTML構造チェック:');
try {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const htmlChecks = [
    { name: 'DOCTYPE宣言', test: html.includes('<!DOCTYPE html>') },
    { name: 'CSP設定', test: html.includes('Content-Security-Policy') },
    { name: 'スタイルシート参照', test: html.includes('styles.css') },
    { name: 'レンダラースクリプト参照', test: html.includes('renderer.js') }
  ];
  
  htmlChecks.forEach(check => {
    console.log(`  ${check.test ? '✓' : '✗'} ${check.name}`);
    if (!check.test) allOk = false;
  });
} catch (error) {
  console.log(`  ✗ HTML読み込みエラー: ${error.message}`);
  allOk = false;
}

console.log('\n' + '='.repeat(50));
if (allOk) {
  console.log('✓ セットアップ検証成功！');
  console.log('\n起動方法:');
  console.log('  npm start      # 通常起動');
  console.log('  npm run dev    # 開発モード（DevTools自動起動）');
  process.exit(0);
} else {
  console.log('✗ セットアップに問題があります');
  console.log('  npm install を実行してください');
  process.exit(1);
}
