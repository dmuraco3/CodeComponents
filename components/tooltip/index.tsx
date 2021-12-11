import style from './tooltip.module.css'
const ToolTip: React.FC<{text: string}> = ({text, children}) => {
    return (
        <div className={`${style.tooltip}`}>
            {children}
            <div className={style.bottom}>
                <span>{text}</span>
            </div>
        </div>

    )
}

export default ToolTip;