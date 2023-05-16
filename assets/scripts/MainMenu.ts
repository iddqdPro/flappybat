import { _decorator, Component, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MainMenu')
export class MainMenu extends Component {
    start() {

    }

    private startGame() {
        director.loadScene("MainScene");
    }

    update(deltaTime: number) {
        
    }
}

