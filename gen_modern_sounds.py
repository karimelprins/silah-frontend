import wave, math, struct
import os

def make_modern_sound(filename, freqs_durations, decay=10.0, waveform='sine'):
    sampleRate = 44100
    obj = wave.open(filename, 'w')
    obj.setnchannels(1)
    obj.setsampwidth(2)
    obj.setframerate(sampleRate)
    
    for duration, freq in freqs_durations:
        for i in range(int(sampleRate * duration)):
            t = float(i) / sampleRate
            
            # Frequency drop for modern error "thump"
            current_freq = freq
            if waveform == 'thump':
                current_freq = freq * math.exp(-t * 20)
                
            if waveform in ['sine', 'thump']:
                value = math.sin(2.0 * math.pi * current_freq * t)
            elif waveform == 'bell':
                # Bright modern bell/chime (fundamental + harmonics)
                value = (math.sin(2.0 * math.pi * current_freq * t) + 
                         0.5 * math.sin(2.0 * math.pi * current_freq * 2.0 * t) +
                         0.25 * math.sin(2.0 * math.pi * current_freq * 3.0 * t)) / 1.75
            
            # Smooth exponential decay for a sleek modern sound (no retro sustain)
            env = math.exp(-decay * t)
            
            # Very short attack to prevent clicks
            if t < 0.005: 
                env *= (t / 0.005)
                
            sample = int(16383.0 * value * env)
            data = struct.pack('<h', sample)
            obj.writeframesraw(data)
    obj.close()

target_dir = "c:/Users/user/OneDrive/Desktop/silahFrontEnd/assets"
if not os.path.exists(target_dir):
    os.makedirs(target_dir)

print("Generating modern success sound...")
# Happy, bright, soft chime (C6, E6, G6) with fast decay
make_modern_sound(f'{target_dir}/success.wav', [
    (0.12, 1046.50), 
    (0.12, 1318.51), 
    (0.6, 1567.98)
], decay=12.0, waveform='bell')

print("Generating modern error sound...")
# Soft, low dull thump (like a subtle UI pop/drop)
make_modern_sound(f'{target_dir}/error.wav', [
    (0.4, 300)
], decay=15.0, waveform='thump')

print("Done! Modern sounds generated successfully.")
