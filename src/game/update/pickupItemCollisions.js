import { playEffect } from "../../game/util";
import { effects } from "../../enums/effects";
import { items } from "../../enums/items";
import { deaths } from "../../enums/deaths";
import { ItemInvisibility } from "../../game/Items/itemInvisibility";

const handlePickupItemCollisions = (
    player,
    level,
    itemManager,
    gameManager
) => {
    game.physics.arcade.overlap(
        player.sprite,
        itemManager.activeItems,
        (_, item) => {
            switch (item.data.type) {
                case items.DEATH:
                    player.clearItem();
                    gameManager.killPlayer(player, deaths.SKULL);
                    break;
                case items.VOLTS:
                    player.setItem(new ItemVolts(player));
                    break;
                case items.INVISIBILITY:
                    player.setItem(new ItemInvisibility(player));
                    break;
                case items.MINE:
                    player.setItem(new ItemMine(player));
                    break;
                case items.GUN:
                    player.setItem(new ItemGun(player));
                    break;
                case items.TNT:
                    return;
                case items.BOOTS:
                    player.setItem(new ItemBoots(player));
                    break;
                case items.GRENADE:
                    player.setItem(new ItemGrenade(player));
                    break;
                case items.PUCK:
                    player.setItem(new ItemPuck(player));
                    break;
                case items.CHUTE:
                    player.setItem(new ItemChute(player));
                    break;
                case items.HOOK:
                    player.setItem(new ItemHook(player));
                    break;
                case items.WARP:
                    player.clearItem();
                    gameManager.warpPlayer(player);
                    break;
                default:
                    player.clearItem();
                    break;
            }

            playEffect(effects.DIE, item.x, item.y);
            item.destroy();
        }
    );

    itemManager.activeItems.forEach(item => {
        if (item.data.type !== items.TNT) {
            return;
        }

        game.physics.arcade.overlap(level.platforms, item, (platform, _) => {
            playEffect(effects.GRAY_PUFF, platform.x, platform.y);

            level.platforms.remove(platform);

            platform.kill();
        });
    });
};

export { handlePickupItemCollisions };
