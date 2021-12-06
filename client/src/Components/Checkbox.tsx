import { useState } from "react";
import JsxParser from 'react-jsx-parser'; 

interface Props {
	forceState?: boolean;
	className: string;
	content: any;
  	onClick: (isChecked: boolean) => void;
}

const Checkbox = (props: Props) => {
	const { forceState, className, content, onClick } = props;
  	const [ isChecked, setChecked ] = useState<boolean>(forceState || false)	

  	return (
        <div 
            className={`${className} btn ${(forceState === undefined ? isChecked : forceState) ? 'btn-checked' : ''}`} 
            onClick={() => { 	
				const update = forceState === undefined ? !isChecked : !forceState								
				onClick( update ); 
				setChecked( update ); 
			}}>
            <JsxParser jsx={content}></JsxParser>
        </div>
  	);
};
export default Checkbox;