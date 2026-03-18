import useCopy from '@/hooks/useCopy';

type CopyButtonProps = {
  copyText: string;
  btnTheme?: string;
  btnText?: string;
};

function CopyButton({ copyText, btnTheme = 'secondary', btnText = '' }: CopyButtonProps) {
  const { copied, handleCopy } = useCopy();

  return (
    <button type="button" className={`btn btn-${btnTheme} btn-sm`} onClick={() => handleCopy(copyText)} disabled={copied}>
      {copied ? <i className="bi bi-clipboard-check me-2"></i> : <i className="bi bi-clipboard me-2"></i>}
      {copied ? '已複製' : '複製'}
      {btnText}
    </button>
  );
}

export default CopyButton;
