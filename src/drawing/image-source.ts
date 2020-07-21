
export class ImageSource
{
    imageId: string;
    imageUrl: string;

    constructor(imageId: string, imageUrl: string)
    {
        this.imageId = imageId;
        this.imageUrl = imageUrl;
    }

    // PIXI stuff
    private static imageSourcesMapPixi: Map<string, ImageSource>;
    public static get keys() { return Array.from(ImageSource.imageSourcesMapPixi.keys()); }
    private baseTexture: PIXI.BaseTexture ;
    public static init()
    { 
      ImageSource.imageSourcesMapPixi = new Map<string, ImageSource>();
    }

    public static AddImagePixi(imageId: string, imageUrl: string)
    {
      let newImageSource = new ImageSource(imageId, imageUrl);
      ImageSource.imageSourcesMapPixi.set(newImageSource.imageId, newImageSource);
    }

    public static getBaseTexture(imageId: string): PIXI.BaseTexture
    {
      let imageSource: ImageSource | undefined = ImageSource.imageSourcesMapPixi.get(imageId);

      if (imageSource == null) return null;

      if (imageSource.baseTexture == null)
        imageSource.baseTexture = new PIXI.BaseTexture(imageSource.imageUrl);
     
      return imageSource.baseTexture;
    }
}