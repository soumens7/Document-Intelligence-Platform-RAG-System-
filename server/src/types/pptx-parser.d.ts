declare module "pptx-parser" {
    interface Slide {
      texts?: { text: string }[];
    }
  
    const pptxParser: {
      parse(filePath: string): Promise<Slide[]>;
    };
  
    export default pptxParser;
  }