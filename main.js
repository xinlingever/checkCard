// ==UserScript==
// @name         扇贝查卡助手
// @version     2018.07.26
// @description 在扇贝的查卡时，自动生成可用csv文件，方便查看
// @author       Aaron Liu
// @supportURL   https://github.com/xinlingever/checkCard
// @license      MIT
// @date         2018-7-26
// @modified     2018-7-26
// @match        *://www.shanbay.com/team/thread/*
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @run-at            document-end
// @grant             unsafeWindow
// @grant             GM_setClipboard
// @grant             GM_xmlhttpRequest
// @namespace undefined
// ==/UserScript==


(function () {
	'use strict';

	var $div = $(document.createElement('div'));

	$div.css({
		'display': 'flex',
		'flex-wrap': 'wrap'
	});

	$div.append(`
<style>
.single-img { width: 220px; }
.name {text-align: center}
.single { margin: 10px 10px 30px 10px;}
</style>
`);

	$('.posttitle .userinfo .span3 .user').each(
		(i, d, n) => {
			// console.log(d.text, ',', $(d.parentNode.parentNode.parentNode.parentNode.parentNode).find('img').attr('src'))
			var imgSrc = $(d.parentNode.parentNode.parentNode.parentNode.parentNode).find('img').attr('src');

			if (imgSrc)
				$div.append(`<div class="single"><div class='name'>${d.text}</div> <img class='single-img' src='${imgSrc}' /></div>`)
		});

	$('body').append($div)
})();