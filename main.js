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
const lanzhi = {
	name: '兰芷馥郁',
	card: undefined,
	members: ['兰芷 ﹏阿喀琉斯メ゛',
		'兰芷 anglems ',
		'兰芷 安行',
		'兰芷 白夜行',
		'兰芷 笔芯',
		'兰芷 不负时光不负卿',
		'兰芷 crq',
		'兰芷 大鸡腿',
		'兰芷 daoying_',
		'兰芷 deadline是勇气',
		'兰芷 怼怼',
		'兰芷 高尔佳',
		'兰芷 Gloria',
		'兰芷 河马叔叔',
		'兰芷 宏文他爸',
		'兰芷 hmilylili123',
		'兰芷 槲栎林',
		'兰芷 Jaye L',
		'兰芷 Jonah',
		'兰芷 蒹葭夭夭',
		'兰芷 江南可采莲',
		'兰芷 江小鱼儿',
		'兰芷 将琴代语',
		'兰芷 婧子昕',
		'兰芷 旧皮',
		'兰芷 洛洛',
		'兰芷 雒萌',
		'兰芷 maggie',
		'兰芷 芒果',
		'兰芷 melody88611',
		'兰芷 命运主宰与轮回大帝',
		'兰芷 茉莉花开',
		'兰芷 -慕昭',
		'兰芷 orange peel',
		'兰芷 浅慕澈天',
		'兰芷 青春不老，我们不散',
		'兰芷 RH',
		'兰芷 sarasd',
		'兰芷 Silhouette',
		'兰芷 striving',
		'兰芷 傻妮儿',
		'兰芷 十堇',
		'兰芷 数学不考100不改名',
		'兰芷 Tyrion',
		'兰芷 伟大的小埋',
		'兰芷 无非语言',
		'兰芷 夏木清川',
		'兰芷 想要腹肌的熊',
		'兰芷 小白',
		'兰芷 小小慧',
		'兰芷 言危士',
		'兰芷 杨立柯',
		'兰芷 叶舞',
		'兰芷 夜之明晓',
		'兰芷 ^倚楼听风雨、',
		'兰芷 柚子_茶',
		'兰芷 云昶丶',
		'兰芷 云中雁',
		'兰芷 周建',
		'兰芷 子之子',
		'兰芷 紫电青霜',
		'兰芷 子羽'
	]
};

const jianshen = {
	name: '健身学习两不误',
	card: undefined,
};

const benniao = {
	name: '笨鸟先飞',
	card: undefined,
};

const teams = [
	lanzhi,
	jianshen,
	benniao
];

(function () {
	'use strict';

	const cards = [];

	var curPage = 1;
	var curLink = window.location.href;

	var $pages = $('.djangoForumPagination');

	var lastPageLink = $pages.last().children(0).attr('href');
	var firstPageLink = $pages.first().children(0).attr('href');
	var prePageLink = $pages.eq(1).children(0).attr('href');
	var nexPageLink = $pages.eq(2).children(0).attr('href');

	var totalPageCnt = lastPageLink.substr(lastPageLink.indexOf('=') + 1);
	console.log(totalPageCnt);

	console.log(curLink);

	var paramIndex = curLink.indexOf('?');

	var basePageLink = paramIndex > 0 ? curLink.substring(0, paramIndex) : curLink;
	console.log(basePageLink);

	var getPage = (pageIndex, callback) => {
		console.log('get page: ' + basePageLink + '?page=' + pageIndex);
		GM_xmlhttpRequest({
			method: "GET",
			url: basePageLink + '?page=' + pageIndex,
			onload: function (response) {
				console.log('END get page: ' + basePageLink + '?page=' + pageIndex);
				var holder = document.createElement("div");
				holder.innerHTML = response.responseText;

				$('.posttitle .userinfo .span3 .user', holder).each((j, d, n) => {
					var card = {};
					card.NO = cards.length + 1;
					card.name = d.text;
					card.img = $(d.parentNode.parentNode.parentNode.parentNode.parentNode).find('img').attr('src');
					card.team = $('.team .user', d.parentNode.parentNode).text();
					// console.log(`${card.NO}: ${card.name}, ${card.img}`);

					if (card.img)
						cards.push(card);
				});

				if (pageIndex < totalPageCnt) {
					pageIndex++;

					getPage(pageIndex, callback);
				} else {
					callback();
				}
			}
		});
	};

	var createCard = (card) => {
		var isChecked = false;
		if (card.img) isChecked = true;

		return `<div class="single ${isChecked ? 'OK' : 'no-check'}">
		<div class='name'>
			<span class='single-no'>${card.NO}</span>
			${card.name}
			<span class='single-of-team'>${card.team}</span>
		</div> 
		<img class='single-img' src='${card.img}' />
		<div class='no-check-info' />
		</div>`;
	};

	var showCard = () => {
		var $div = $(document.createElement('div'));

		$div.css({
			'display': 'flex',
			'flex-wrap': 'wrap'
		});

		$div.append(`
			<style>
			.single-img { width: 220px; }
			.name {text-align: center; font-size: 18px; color: green;}
			.single { margin: 10px 10px 30px 10px;}
			.single-no {color: gray; font-size: 12px; margin-right: 12px;}
			.single-of-team {opacity: 0.3; font-size: 12px;}

			.no-check-info {
				display: none;
				width: 220px;
			}

			.no-check .single-img {
				display: none;
			}

			.no-check .no-check-info {
				display: block;
			}

			.no-check .name {color: red}
			</style>
			`);

		for (let i = 0; i < cards.length; i++) {
			var d = cards[i];
			$div.append(createCard(d));

		}

		$('body').append($div)

	}

	var compareName = (nameA, nameB) => {
		const name1 = nameA.replace('【兰芷】', '').replace('[兰芷]', '').replace('兰芷', '').toLowerCase().trim();
		const name2 = nameB.replace('【兰芷】', '').replace('[兰芷]', '').replace('兰芷', '').toLowerCase().trim();

		// if (name1 === name2)
		// 	console.log(`${nameA} === ${nameB}`);
		return name1 === name2;
	}

	var showList = () => {

		const noCheckList = [];
		const memList = [];
		if (cards.length > 0) {
			var teamName = cards[0].team;

			console.log('team:' + teamName);

			for (let i = 0; i < teams.length; i++) {
				if (teams[i].name === teamName) {
					console.log('find team');
					const team = teams[i];

					for (let j = 0; j < team.members.length; j++) {
						memList.push({
							id: memList.length + 1,
							name: team.members[j],
							card: undefined
						});
					}

					break;
				}
			}
		}

		if (memList.length === 0) return;

		for (let i = 0; i < memList.length; i++) {
			const mem = memList[i];

			for (let j = 0; j < cards.length; j++) {
				// console.log(mem.name, cards[j].name);
				if (compareName(mem.name, cards[j].name)) {
					mem.card = cards[j];
					break;
				}
			}

		}


		var $div = $(document.createElement('div'));

		$div.css({
			'display': 'flex',
			'flex-wrap': 'wrap'
		});

		$div.append(`
			<style>
			.single-img { width: 220px; }
			.name {text-align: center; font-size: 18px; color: green;}
			.single { margin: 10px 10px 30px 10px;}
			.single-no {color: gray; font-size: 12px; margin-right: 12px;}
			.single-of-team {opacity: 0.3; font-size: 12px;}

			.no-check-info {
				display: none;
				width: 220px;
			}

			.no-check .single-img {
				display: none;
			}

			.no-check .no-check-info {
				display: block;
			}

			.no-check .name {color: red}
			</style>
			`);

		for (let i = 0; i < memList.length; i++) {
			let d = undefined;
			if (memList[i].card) {
				d = JSON.parse(JSON.stringify(memList[i].card));
				d.NO = i + 1;

				$div.append(createCard(d));
			} else
				$div.append(createCard({
					name: memList[i].name,
					NO: i + 1,
					img: undefined
				}));
		}

		$('body').append($div)
	}

	getPage(1, () => {
		// showCard();

		showList();
	});


})();
