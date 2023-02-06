// From: https://stackoverflow.com/a/36475516
export const compass = ({ deg }: { deg: number }): string => {
    if (deg > 337.5) {
       return 'Nord'; 
      }
    if (deg > 292.5) {
       return 'Nord vest'; 
      }
    if (deg > 247.5) {
       return 'Vest'; 
      }
    if (deg > 202.5) {
       return 'Syd vest'; 
      }
    if (deg > 157.5) {
       return 'Syd'; 
      }
    if (deg > 122.5) {
       return 'Syd øst'; 
      }
    if (deg > 67.5) { 
      return 'Øst'; 
    }
    if (deg > 22.5) { 
      return 'Nord øst'; 
    }
    return 'Nord';
  }