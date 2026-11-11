using backend.DTOs.Lottery;

namespace backend.Interfaces;

public interface ILotteryService
{
    Task<List<LotteryResultResponse>> RunLotteryAsync(
        RunLotteryRequest request,
        Guid drawnByUserId
    );

    Task<List<LotteryDrawResponse>> GetLotteryDrawsAsync();

    Task PublishLotteryResultAsync(Guid lotteryDrawId);

    Task<List<LotteryResultResponse>> GetPublishedResultAsync(
        Guid circularId,
        Guid shiftId
    );
}