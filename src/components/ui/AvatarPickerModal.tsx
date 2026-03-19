import { useMemo, useState } from 'react';
import { X, Image as ImageIcon, Smile, Shapes, Trash2, Check } from 'lucide-react';
import type { Avatar } from '../../types';
import { avatarIconOptions } from './Avatar';
import { imageFileToSquareDataUrl } from '../../utils/avatarImage';
import { firstGrapheme } from '../../utils/grapheme';

type Mode = 'image' | 'emoji' | 'icon';

export function AvatarPickerModal({
  title,
  initialAvatar,
  onClose,
  onSave,
}: {
  title: string;
  initialAvatar?: Avatar;
  onClose: () => void;
  onSave: (avatar?: Avatar) => void;
}) {
  const initialMode: Mode = useMemo(() => {
    if (initialAvatar?.kind === 'image') return 'image';
    if (initialAvatar?.kind === 'emoji') return 'emoji';
    return 'icon';
  }, [initialAvatar]);

  const [mode, setMode] = useState<Mode>(initialMode);
  const [emojiInput, setEmojiInput] = useState(initialAvatar?.kind === 'emoji' ? initialAvatar.emoji : '');
  const [selectedIcon, setSelectedIcon] = useState(
    initialAvatar?.kind === 'icon' ? initialAvatar.icon : 'book'
  );
  const [imageDataUrl, setImageDataUrl] = useState(
    initialAvatar?.kind === 'image' ? initialAvatar.dataUrl : ''
  );
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const activeAvatar: Avatar | undefined = useMemo(() => {
    if (mode === 'image') return imageDataUrl ? { kind: 'image', dataUrl: imageDataUrl } : undefined;
    if (mode === 'emoji') {
      const g = firstGrapheme(emojiInput);
      return g ? { kind: 'emoji', emoji: g } : undefined;
    }
    return { kind: 'icon', icon: selectedIcon };
  }, [emojiInput, imageDataUrl, mode, selectedIcon]);

  const handlePickImage = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setIsBusy(true);
    try {
      if (file.size > 8 * 1024 * 1024) {
        throw new Error('圖片太大了（請小於 8MB）');
      }
      const dataUrl = await imageFileToSquareDataUrl(file, 128);
      setImageDataUrl(dataUrl);
      setMode('image');
    } catch (e: any) {
      setError(e?.message ?? '圖片處理失敗');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-md p-0 sm:p-5">
      <div className="w-full max-w-md bg-apple-bg/90 dark:bg-apple-bg-dark/90 backdrop-blur-3xl rounded-t-[2.5rem] sm:rounded-[2.5rem] shadow-soft-dark border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-6 border-b border-apple-border/50 dark:border-apple-border-dark/50 bg-transparent z-10 sticky top-0">
          <h2 className="text-2xl font-display font-bold tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-apple-bg dark:bg-black/50 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
            aria-label="關閉"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          <div className="grid grid-cols-3 gap-2 bg-apple-card/40 dark:bg-apple-card-dark/40 rounded-[1.5rem] p-2 border border-white/30 dark:border-white/10">
            <button
              onClick={() => {
                setMode('image');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-semibold transition-all outline-none ${
                mode === 'image' ? 'bg-white/70 dark:bg-black/40 text-apple-text dark:text-apple-text-dark' : 'text-gray-500 hover:bg-white/40 dark:hover:bg-black/20'
              }`}
            >
              <ImageIcon size={16} /> 圖片
            </button>
            <button
              onClick={() => {
                setMode('emoji');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-semibold transition-all outline-none ${
                mode === 'emoji' ? 'bg-white/70 dark:bg-black/40 text-apple-text dark:text-apple-text-dark' : 'text-gray-500 hover:bg-white/40 dark:hover:bg-black/20'
              }`}
            >
              <Smile size={16} /> Emoji
            </button>
            <button
              onClick={() => {
                setMode('icon');
                setError('');
              }}
              className={`flex items-center justify-center gap-2 py-3 rounded-[1.25rem] text-sm font-semibold transition-all outline-none ${
                mode === 'icon' ? 'bg-white/70 dark:bg-black/40 text-apple-text dark:text-apple-text-dark' : 'text-gray-500 hover:bg-white/40 dark:hover:bg-black/20'
              }`}
            >
              <Shapes size={16} /> Icon
            </button>
          </div>

          {mode === 'image' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
                上傳圖片
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    void handlePickImage(file);
                    e.currentTarget.value = '';
                  }}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-apple-blue-heavy file:text-white hover:file:opacity-90"
                  disabled={isBusy}
                />
                {imageDataUrl && (
                  <button
                    onClick={() => setImageDataUrl('')}
                    className="p-3 rounded-xl bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/30 dark:border-white/10 text-gray-500 hover:text-red-500 transition-colors"
                    aria-label="移除圖片"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              {imageDataUrl && (
                <div className="flex items-center justify-center">
                  <img
                    src={imageDataUrl}
                    alt=""
                    className="w-20 h-20 rounded-[1.5rem] object-cover shadow-inner border border-white/40 dark:border-white/10"
                  />
                </div>
              )}
            </div>
          )}

          {mode === 'emoji' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
                輸入一個 emoji（例如：😎）
              </label>
              <input
                type="text"
                value={emojiInput}
                onChange={(e) => {
                  setEmojiInput(e.target.value);
                  setError('');
                }}
                placeholder="😎"
                className="w-full bg-apple-card/60 dark:bg-apple-card-dark/60 border border-white/50 dark:border-white/10 rounded-[1.5rem] px-5 py-4 outline-none focus:ring-2 focus:ring-apple-blue-heavy transition-all text-lg"
              />
              <div className="text-sm text-gray-500">
                目前：<span className="text-lg">{firstGrapheme(emojiInput) || '（空）'}</span>
              </div>
            </div>
          )}

          {mode === 'icon' && (
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400">
                選擇 icon
              </label>
              <div className="grid grid-cols-5 gap-2">
                {avatarIconOptions.map(({ key, label, Icon }) => {
                  const active = selectedIcon === key;
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        setSelectedIcon(key);
                        setError('');
                      }}
                      className={`h-14 rounded-[1.25rem] border transition-all outline-none flex items-center justify-center ${
                        active
                          ? 'bg-white/70 dark:bg-black/40 border-apple-blue-heavy/50 text-apple-blue-heavy'
                          : 'bg-apple-card/40 dark:bg-apple-card-dark/40 border-white/30 dark:border-white/10 text-gray-500 hover:bg-white/40 dark:hover:bg-black/20'
                      }`}
                      aria-label={label}
                      title={label}
                    >
                      <Icon size={22} />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {error && <div className="text-sm text-red-500">{error}</div>}
        </div>

        <div className="p-6 border-t border-apple-border/50 dark:border-apple-border-dark/50 bg-transparent z-10 flex gap-3">
          <button
            onClick={() => onSave(undefined)}
            className="flex-1 bg-apple-card/60 dark:bg-apple-card-dark/60 text-gray-500 font-rounded font-bold py-4 rounded-[1.5rem] hover:opacity-90 active:scale-95 transition-all border border-white/30 dark:border-white/10"
          >
            清除頭像
          </button>
          <button
            onClick={() => {
              if (mode === 'emoji' && !firstGrapheme(emojiInput)) {
                setError('請輸入一個 emoji');
                return;
              }
              if (mode === 'image' && !imageDataUrl) {
                setError('請先上傳圖片');
                return;
              }
              onSave(activeAvatar);
            }}
            className="flex-1 bg-apple-blue-heavy text-white font-rounded font-bold py-4 rounded-[1.5rem] hover:bg-apple-blue active:scale-95 transition-all shadow-soft-hover disabled:opacity-60 disabled:active:scale-100 flex items-center justify-center gap-2"
            disabled={isBusy}
          >
            <Check size={18} /> 儲存
          </button>
        </div>
      </div>
    </div>
  );
}

