var tbody = document.querySelector('#table tbody');
let dataset = [];
let stopFlag = false;
let openSqr = 0;
let code = {
    open : -1,
    qst : -2,
    flag : -3,
    flagmine : -4,
    qstmine : -5,
    mine : 1,
    normal : 0
}
document.querySelector('#exec').addEventListener('click', function () {
    //내부 먼저 초기화
    openSqr = 0;
    stopFlag = false;
    tbody.innerHTML = '';
    dataset = [];
    document.querySelector('#result').textContent='';
    // let hor = parseInt(document.querySelector('#hor').value);
    // let ver = parseInt(document.querySelector('#ver').value);
    // let mine = parseInt(document.querySelector('#mine').value);
    let hor = 10;
    let ver = 10;
    let mine = 10;

    //지뢰의 위치 뽑기
    let num_list = Array(hor * ver)
    .fill()
    .map(function (item, index) {
        return index;
    });
    let shuffle = [];
    while (num_list.length > hor * ver - mine) {
        let selected_num = num_list.splice(Math.floor(Math.random() * num_list.length), 1)[0];
        shuffle.push(selected_num);
    }

    //지뢰 테이블 만들기
    for (let i = 0; i < ver; i++) {
        let arr = [];
        let tr = document.createElement('tr');
        dataset.push(arr);
        for (let j = 0; j < hor; j++) {
            arr.push(code.normal);
            let td = document.createElement('td');
            td.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if(stopFlag===true){
                    return;
                }
                let parentTr = e.currentTarget.parentNode;
                let parentTbody = e.currentTarget.parentNode.parentNode;
                let tdX = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
                let tdY = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                if (dataset[tdY][tdX] === code.normal || dataset[tdY][tdX] === code.mine) {
                    e.currentTarget.classList.add('flag');
                    if(dataset[tdY][tdX]===code.mine){
                        dataset[tdY][tdX]=code.flagmine;
                    }else{
                        dataset[tdY][tdX]=code.flag;
                    }
                } else if (dataset[tdY][tdX] === code.flag || dataset[tdY][tdX] === code.flagmine) {
                    e.currentTarget.classList.add('qst');
                    e.currentTarget.classList.remove('flag');
                    if(dataset[tdY][tdX]===code.flagmine){
                        dataset[tdY][tdX]=code.qstmine;
                    }else{
                        dataset[tdY][tdX]=code.qst;
                    }
                } else if (dataset[tdY][tdX] === code.qst || dataset[tdY][tdX] === code.qstmine) {
                    e.currentTarget.classList.remove('qst');
                    if (dataset[tdY][tdX] === code.qstmine) {
                        e.currentTarget.textContent = 'X';
                        dataset[tdY][tdX] = code.mine;
                    }else{
                        e.currentTarget.textContent = '';
                        dataset[tdY][tdX] = code.normal;
                    }
                }
            });
            td.addEventListener('click', function (e) {
                if(stopFlag===true){
                    return;
                }
                let parentTr = e.currentTarget.parentNode;
                let parentTbody = e.currentTarget.parentNode.parentNode;
                let tdX = Array.prototype.indexOf.call(parentTr.children, e.currentTarget);
                let tdY = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                if([code.open, code.flag, code.flagmine, code.qst, code.qstmine].includes(dataset[tdY][tdX])){
                    return;
                }
                //클릭 시 주변 지뢰 개수
                e.currentTarget.classList.add('opened');
                if (dataset[tdY][tdX] === code.mine) {
                    document.querySelector('#result').textContent='실패!';
                    stopFlag = true;
                    for(let i=0; i<dataset.length; i++){
                        for(let j=0; j<dataset[i].length; j++){
                            if(dataset[i][j]===code.mine){
                                tbody.children[i].children[j].style.backgroundImage = "url('./img/ghost1@2x.png')";
                            }
                        }
                    }
                    e.currentTarget.style.backgroundImage = "url('./img/ghostSelect1@2x.png')";
                } else {
                    openSqr++;
                    let around = [
                        dataset[tdY][tdX - 1], dataset[tdY][tdX + 1]
                    ];
                    if (dataset[tdY - 1]) {
                        around = around.concat([dataset[tdY - 1][tdX - 1], dataset[tdY - 1][tdX], dataset[tdY - 1][tdX + 1]]);
                    }
                    if (dataset[tdY + 1]) {
                        around = around.concat([dataset[tdY + 1][tdX - 1], dataset[tdY + 1][tdX], dataset[tdY + 1][tdX + 1]]);
                    }
                    let aroundMine = around.filter(function (v) {
                        return [code.mine, code.qstmine, code.flagmine].includes(v);
                    }).length;
                    e.currentTarget.style.backgroundImage = "url('./img/num"+aroundMine+"@2x.png')";
                    dataset[tdY][tdX]=code.open;
                    if (aroundMine === 0) {
                        let aroundSqr = [];
                        if (tbody.children[tdY - 1]) {
                            aroundSqr = aroundSqr.concat([
                                tbody.children[tdY - 1].children[tdX - 1],
                                tbody.children[tdY - 1].children[tdX],
                                tbody.children[tdY - 1].children[tdX + 1]
                            ]);
                        }
                        aroundSqr = aroundSqr.concat([
                            tbody.children[tdY].children[tdX - 1],
                            tbody.children[tdY].children[tdX + 1]
                        ]);
                        if (tbody.children[tdY + 1]) {
                            aroundSqr = aroundSqr.concat([
                                tbody.children[tdY + 1].children[tdX - 1],
                                tbody.children[tdY + 1].children[tdX],
                                tbody.children[tdY + 1].children[tdX + 1]
                            ]);
                        }
                        aroundSqr.filter(function (v){
                            return !!v;
                        }).forEach(function(next){
                            let parentTr = next.parentNode;
                            let parentTbody = next.parentNode.parentNode;
                            let nextX = Array.prototype.indexOf.call(parentTr.children, next);
                            let nextY = Array.prototype.indexOf.call(parentTbody.children, parentTr);
                            if(dataset[nextY][nextX] !== code.open){
                                next.click();
                            }
                        })

                    };
                }
                if(openSqr===hor*ver-mine){
                    stopFlag = true;
                    document.querySelector('#result').textContent = '승리!';
                }
            });
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

    //지뢰 심기
    for (let k = 0; k < shuffle.length; k++) {
        let ver_pos = Math.floor(shuffle[k] / hor);
        let hor_pos = shuffle[k] % hor;
        tbody.children[ver_pos].children[hor_pos].textContent = "X";
        dataset[ver_pos][hor_pos] = code.mine;
    }
});