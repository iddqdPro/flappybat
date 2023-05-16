import { _decorator, Component, Node, input, Input, RigidBody2D, Vec2, Prefab, director, instantiate,
    Collider2D, Contact2DType, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    @property(Node)
    player: Node;
    @property(Node)
    failureWindow: Node;

    @property(Prefab)
    topObstacle: Prefab;
    @property(Prefab)
    bottomObstacle: Prefab;
    @property(Prefab)
    sensor: Prefab;

    @property(Label)
    scoreLabel: Label;

    isGameStarted = false;
    score = 0;

    start() {
        input.on(Input.EventType.TOUCH_START, this.jump, this);
        this.player.getComponent(Collider2D).on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        this.player.getComponent(Collider2D).on(Contact2DType.END_CONTACT, this.endContact, this);
    }

    private onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name !== "Sensor") {
            this.failureWindow.active = true;
            this.unscheduleAllCallbacks();
            director.getScene().getChildByName("Canvas").children.forEach(value => {
                if (value.name === "TopObstacle" || value.name === "Sensor" || value.name === "BottomObstacle") {
                    value.getComponent(RigidBody2D).linearVelocity = new Vec2(0, 0);
                }
            })
        }
    }

    private endContact(selfCollider: Collider2D, otherCollider: Collider2D) {
        if (otherCollider.node.name === "Sensor") {
            this.score += 1;
            this.scoreLabel.string = `Score: ${this.score}`;
        }
    }

    private jump() {
        let body = this.player.getComponent(RigidBody2D);
        body.linearVelocity = new Vec2(0, 0);
        body.applyLinearImpulseToCenter(new Vec2(0, 700), true);

        if (!this.isGameStarted) {
            this.schedule(() => this.generateObstacles(), 0.8);
            this.isGameStarted = true;
        }

    }

    private generateObstacles() {
        let canvas = director.getScene().getChildByName("Canvas");

        let speed = 25;

        let yRandom = (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 300);

        let topObstacle = instantiate(this.topObstacle);
        topObstacle.setParent(canvas);
        topObstacle.setPosition(550, 750 + yRandom);
        topObstacle.setSiblingIndex(3);
        topObstacle.getComponent(RigidBody2D).linearVelocity = new Vec2(-speed, 0);

        let bottomObstacle = instantiate(this.bottomObstacle);
        bottomObstacle.setParent(canvas);
        bottomObstacle.setPosition(550, -750 + yRandom);
        bottomObstacle.setSiblingIndex(3);
        bottomObstacle.getComponent(RigidBody2D).linearVelocity = new Vec2(-speed, 0);

        let sensor = instantiate(this.sensor);
        sensor.setParent(canvas);
        sensor.setPosition(550, yRandom);
        sensor.setSiblingIndex(3);
        sensor.getComponent(RigidBody2D).linearVelocity = new Vec2(-speed, 0);

        this.scheduleOnce(() => {
            topObstacle.destroy();
            bottomObstacle.destroy();
            sensor.destroy();
        }, 2);
    }

    update(deltaTime: number) {
        
    }
}

