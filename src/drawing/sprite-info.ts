import { Vector2 } from "../vector2";
import { BSpriteInfo } from "../b-export/b-sprite-info";
import { DrawHelpers } from "./draw-helpers";
import { ImageSource } from "./image-source";

declare var PIXI: any;

export class SpriteInfo 
{
    public spriteInfoId: string;
    public imageId: string = '';

    // New stuff
    public uvMin: Vector2 = new Vector2();
    public uvSize: Vector2 = new Vector2();
    public realSize: Vector2 = new Vector2();
    public pivot: Vector2 = new Vector2();
    public isIcon: boolean = false;

    constructor(spriteInfoId: string)
    {
        this.spriteInfoId = spriteInfoId;
        this.cleanUp();
    }

    public cleanUp()
    {
    }

    private static spriteInfosMap: Map<string, SpriteInfo>;

    // Keys is used for some repack stuff
    public static get keys() { return Array.from(SpriteInfo.spriteInfosMap.keys()); }
    public static get spriteInfos() { return Array.from(SpriteInfo.spriteInfosMap.values()); }
    public static init()
    {
      SpriteInfo.spriteInfosMap = new Map<string, SpriteInfo>();
    }

    public static load(uiSprites: BSpriteInfo[])
    {
      for (let uiSprite of uiSprites)
      {
        let newUiSpriteInfo = new SpriteInfo(uiSprite.name);
        newUiSpriteInfo.copyFrom(uiSprite);

        let imageUrl: string = DrawHelpers.createUrl(newUiSpriteInfo.imageId, false);
        ImageSource.AddImagePixi(newUiSpriteInfo.imageId, imageUrl)
        
        SpriteInfo.addSpriteInfo(newUiSpriteInfo);
      }
    }

    // TODO should this be here?
    public static addSpriteInfoArray(sourceArray: BSpriteInfo[])
    {
      for (let sOriginal of sourceArray)
      {
        let spriteInfo = new SpriteInfo(sOriginal.name);
        spriteInfo.copyFrom(sOriginal);
        SpriteInfo.addSpriteInfo(spriteInfo);
      }
    }

    public static addSpriteInfo(spriteInfo: SpriteInfo)
    {
      SpriteInfo.spriteInfosMap.set(spriteInfo.spriteInfoId, spriteInfo); 
    }

    public copyFrom(original: BSpriteInfo)
    {
      // TODO refactor
      // DO NOT FORGET : if you add something here, you must add it to the texture repacker also
      let imageUrl: string = DrawHelpers.createUrl(original.textureName, false);
      ImageSource.AddImagePixi(original.textureName, imageUrl);
      this.imageId = original.textureName;
      this.uvMin = Vector2.clone(original.uvMin);
      this.uvSize = Vector2.clone(original.uvSize);
      this.realSize = Vector2.clone(original.realSize);
      this.pivot = Vector2.clone(original.pivot);
      this.isIcon = original.isIcon;
    }

    public static getSpriteInfo(spriteInfoId: string): SpriteInfo
    {
        let returnValue = SpriteInfo.spriteInfosMap.get(spriteInfoId);

        if (returnValue != undefined) return returnValue;
        
        throw new Error('SpriteInfo.getSpriteInfo : Not found');
    }


    // Pixi stuf
    texture: PIXI.Texture;
    public getTexture(): PIXI.Texture
    {
      if (this.texture == null)
      {
        let baseTex = ImageSource.getBaseTexture(this.imageId);
        if (baseTex == null) return null;

        let rectangle = new PIXI.Rectangle(
          this.uvMin.x,
          this.uvMin.y,
          this.uvSize.x,
          this.uvSize.y
        );

        this.texture = new PIXI.Texture(baseTex, rectangle);
      }

      return this.texture;
    }

    public getTextureWithBleed(bleed: number, realBleed: Vector2 = new Vector2()): PIXI.Texture
    {
      let baseTex = ImageSource.getBaseTexture(this.imageId);
      if (baseTex == null) return null;

      let rectangle: PIXI.Rectangle = new PIXI.Rectangle(
        this.uvMin.x - bleed,
        this.uvMin.y - bleed,
        this.uvSize.x + bleed * 2,
        this.uvSize.y + bleed * 2
      );

      if (rectangle.x < 0) rectangle.x = 0;
      if (rectangle.y < 0) rectangle.y = 0;
      if (rectangle.x + rectangle.width > baseTex.width) rectangle.width = baseTex.width - rectangle.x;
      if (rectangle.y + rectangle.height > baseTex.height) rectangle.height = baseTex.height - rectangle.y;

      realBleed.x = this.uvMin.x - rectangle.x;
      realBleed.y = this.uvMin.y - rectangle.y;

      return new PIXI.Texture(baseTex, rectangle);
    }
}