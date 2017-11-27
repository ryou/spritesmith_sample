# GulpでPNGスプライトを生成するサンプル

## 概要

spritesmithはRetina対応しようとすると

+ 等倍サイズ画像
+ Retinaサイズ（2倍解像度）画像

の２種類を用意する必要がある。

これを毎回手作業で用意するのは面倒なので、Retinaサイズ画像だけ用意しておけば後は自動的に等倍サイズを用意してスプライト化・圧縮するGulpタスクをサンプルとして作成。

## 使い方

### imagemagickをインストール

```
brew install imagemagick
```

### 各パッケージインストール

```
npm i
```

### スプライト化

```
npx gulp sprite
```
