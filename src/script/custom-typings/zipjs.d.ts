declare module zipjs {
		
	var workerScriptsPath:string;
	var createReader:(reader:zipjs.Reader, callback:((created:zipjs.Reader) => void)) => void;
	
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
}