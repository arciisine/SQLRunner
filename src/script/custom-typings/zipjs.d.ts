declare module zipjs {
	
	class Reader {
		getEntries:(callback:(entries:zipjs.Entry[]) => void, error:(error:Error) => void) => void;
	}

	class HttpReader extends Reader {
		constructor(url:string);
	}
	
	class Writer {
		
	}
	
	class TextWriter extends Writer {
		
	}
	
	class Entry {
		filename:string;
		getData:(writer:zipjs.Writer, data:(data:any) => void) => void;
	}
	
	export class Zip {
		workerScriptsPath:string;
		createReader:(reader:zipjs.Reader, callback:((created:zipjs.Reader) => void)) => void;

		Reader:typeof zipjs.Reader
		Writer:typeof zipjs.Writer
		HttpReader:typeof zipjs.HttpReader
		TextWriter:typeof zipjs.TextWriter
		Entry:typeof zipjs.Entry
	}

}